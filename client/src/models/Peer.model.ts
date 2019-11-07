import {Room} from './Room.model';
import {BehaviorSubject} from 'rxjs';

export class Peer {

  private static offerOptions = {
    offerToReceiveVideo: true,
  };

  private static peerConnectionConfig = {
    'iceServers': [
      { 'urls': 'stun:stun.l.google.com:19302' },
    ]
  };

  private _remoteStreamPeerConnection: RTCPeerConnection = null;
  private _localStreamPeerConnection: RTCPeerConnection = null;
  private _stream$: BehaviorSubject<MediaStream> = new BehaviorSubject<MediaStream>(null);
  private _isPresenter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);;

  get stream$(): BehaviorSubject<MediaStream> {
    return this._stream$;
  }

  get stream(): MediaStream {
    return this._stream$.value;
  }

  set stream(value: MediaStream) {
    this._stream$.next(value);
  }

  get id(): string {
    return this._id;
  }

  get userName(): string {
    return this._userName;
  }

  get isPresenter$(): BehaviorSubject<boolean> {
    return this._isPresenter$;
  }

  get isPresenter(): boolean {
    return this._isPresenter$.value;
  }

  set isPresenter(value: boolean) {
    this._isPresenter$.next(value);
  }

  constructor(private _id: string, private _userName: string, private _room: Room) {
  }

  public sendOfferForRemoteStream() {
    if (this._remoteStreamPeerConnection != null) {
      return;
    }

    this._remoteStreamPeerConnection = new RTCPeerConnection(Peer.peerConnectionConfig);
    this._remoteStreamPeerConnection.ontrack = this.onRemoteStreamReceived.bind(this);

    this._remoteStreamPeerConnection.createOffer(Peer.offerOptions)
      .then(description => {
        this._remoteStreamPeerConnection.setLocalDescription(description)
          .then(() => {
            console.log('Sending a local description offer to ' + this._id);
            this._room.emit('offer', {
              peerId: this._id,
              data: {
                sdp: this._remoteStreamPeerConnection.localDescription
              }
            });
          }).catch(error => {
          console.log('error creating local description ', error);
        });
      })
      .catch(error => {
        console.log('error creating offer ', error);
      });
  }

  public sendAnswerForLocalStream(sdp: any, stream: MediaStream) {
    if (this._localStreamPeerConnection) {
      this._localStreamPeerConnection.close();
    }

    this._localStreamPeerConnection = new RTCPeerConnection(Peer.peerConnectionConfig);

    // Add local stream
    const localTrack = stream.getTracks()[0];
    this._localStreamPeerConnection.addTrack(localTrack, stream);
    this._localStreamPeerConnection.onicecandidate = this.onLocalIceCandidate.bind(this);

    const sessionDescription = new RTCSessionDescription(sdp);
    this._localStreamPeerConnection.setRemoteDescription(sessionDescription)
      .then(() => {
        console.log('Got remote description offer from ' + this._id + ': sending answer');
        // Create an answer
        this._localStreamPeerConnection.createAnswer()
          .then(description => {
            this._localStreamPeerConnection.setLocalDescription(description)
              .then(() => {
                this._room.emit('answer', {
                  peerId: this._id,
                  data: {
                    sdp: this._localStreamPeerConnection.localDescription
                  }
                });
              }).catch(error => {
              console.log('error creating local description ', error);
            });
          })
          .catch(error => {
            console.log('error creating answer ', error);
          });
      })
      .catch(error => {
        console.log('error setting remote description from offer', error);
      });
  }

  public onRemoteStreamAnswer(sdp: any) {
    console.log('Got remote description answer from ' + this._id);
    const sessionDescription = new RTCSessionDescription(sdp);
    this._remoteStreamPeerConnection.setRemoteDescription(sessionDescription)
      .catch(error => {
        console.log('error setting remote description from answer', error);
      });
  }

  public onLocalIceCandidate(event: any) {
    const { candidate } = event;

    if (candidate != null) {
      console.log('Sending local iceCandidate to ' + this._id);
      this._room.emit('candidate', {
        peerId: this._id,
        data: {
          candidate: candidate
        }
      });
    }
  }

  public onRemoteIceCandidate(candidate: any) {
    const iceCandidate = new RTCIceCandidate(candidate);

    console.log('Got a remote ice candidate from ' + this._id);
    this._remoteStreamPeerConnection.addIceCandidate(iceCandidate)
      .then(() => {
      })
      .catch(error => {
        console.log('error setting ice candidate ', error);
      });
  }

  public onLocalStreamStopped() {
    if (this._localStreamPeerConnection != null) {
      this._localStreamPeerConnection.close();
      this._localStreamPeerConnection = null;
    }
  }

  private onRemoteStreamReceived(event: any) {
    console.log('Received a remote stream');

    // Update stream (observable)
    this.stream = event.streams[0];

    // // Notify room
    this._room.onRemoteStreamReceived(this);
  }

  public onRemoteStreamStopped() {
    console.log('A remote stream stopped');
    if (this._remoteStreamPeerConnection != null) {
      this._remoteStreamPeerConnection.close();
      this._remoteStreamPeerConnection = null;
    }

    // Update stream (observable)
    this.stream = null;
  }
}