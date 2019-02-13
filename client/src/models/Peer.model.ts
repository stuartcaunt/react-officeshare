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
  private _remoteStream: MediaStream = null;

  constructor(private _socket: SocketIOClient.Socket, private _remotePeerId: string) {
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
            console.log('Sending a local description offer to ' + this._remotePeerId);
            this._socket.emit('offer', {
              peerId: this._remotePeerId,
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
        console.log('Got remote description offer from ' + this._remotePeerId + ': sending answer');
        // Create an answer
        this._localStreamPeerConnection.createAnswer()
          .then(description => {
            this._localStreamPeerConnection.setLocalDescription(description)
              .then(() => {
                this._socket.emit('answer', {
                  peerId: this._remotePeerId,
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
    console.log('Got remote description answer from ' + this._remotePeerId);
    const sessionDescription = new RTCSessionDescription(sdp);
    this._remoteStreamPeerConnection.setRemoteDescription(sessionDescription)
      .catch(error => {
        console.log('error setting remote description from answer', error);
      });
  }

  public onLocalIceCandidate(event: any) {
    const { candidate } = event;

    if (candidate != null) {
      console.log('Sending local iceCandidate to ' + this._remotePeerId);
      this._socket.emit('candidate', {
        peerId: this._remotePeerId,
        data: {
          candidate: candidate
        }
      });
    }
  }

  public onRemoteIceCandidate(candidate: any) {
    const iceCandidate = new RTCIceCandidate(candidate);

    console.log('Got a remote ice candidate from ' + this._remotePeerId);
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

    this._remoteStream = event.streams[0];

    // TODO set an observable
  }

  public onRemoteStreamStopped() {
    console.log('A remote stream stopped');
    if (this._remoteStreamPeerConnection != null) {
      this._remoteStreamPeerConnection.close();
      this._remoteStreamPeerConnection = null;
    }

    this._remoteStream = null;

    // TODO set an observable
  }
}