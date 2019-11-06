import {Peer} from './Peer.model';
import {BehaviorSubject} from 'rxjs';

export class Room {
  private _remotePeers: Array<Peer> = [];

  private _peers: Array<Peer> = [];
  private _peers$: BehaviorSubject<Array<Peer>> = new BehaviorSubject([]);

  private _localPeer: Peer = null;

  private _activePeer$: BehaviorSubject<Peer> = new BehaviorSubject<Peer>(null);

  get peers(): Array<Peer> {
    return this._peers;
  }

  get peers$(): BehaviorSubject<Array<Peer>> {
    return this._peers$;
  }

  get activePeer(): Peer {
    return this._activePeer$.value;
  }

  set activePeer(value: Peer) {
    this._activePeer$.next(value);
  }

  get activePeer$(): BehaviorSubject<Peer> {
    return this._activePeer$;
  }

  get localPeer(): Peer {
    return this._localPeer;
  }

  get name(): string {
    return this._roomName;
  }

  constructor(private _socket: SocketIOClient.Socket, peerDataArrays: Array<any>, private _roomName: string, private _userName: string) {

    // Create a local peer
    this._localPeer = new Peer(this._socket.id, this._userName, this);
    this.createPeerList();

    // Set socket listeners
    this._socket.on('join', this.onPeerJoined.bind(this));
    this._socket.on('leave', this.onPeerLeft.bind(this));
    this._socket.on('stream_started', this.onRemoteStreamStarted.bind(this));
    this._socket.on('stream_stopped', this.onRemoteStreamStopped.bind(this));
    this._socket.on('offer', this.onOffer.bind(this));
    this._socket.on('answer', this.onAnswer.bind(this));
    this._socket.on('candidate', this.onIceCandidate.bind(this));

    // Store current peer
    peerDataArrays.forEach(peerData => {
      const peer = this.createPeer(peerData.id, peerData.userData.userName);

      // If peer is streaming then get remote stream
      if (peerData.userData.streaming) {
        peer.sendOfferForRemoteStream();
      }
    });
  }

  public startStreaming(stream: MediaStream) {
    this._localPeer.stream = stream;

    // Update main stream
    this.activePeer = this._localPeer;

    // Broadcast event to all other peers
    this._socket.emit('stream_started');
  }

  public stopStreaming() {
    // Check if main stream
    if (this.activePeer === this._localPeer) {
      this.activePeer = null;
    }

    // Update stream in local peer
    if (this._localPeer.stream != null) {
      this._localPeer.stream.getTracks()[0].stop();
    }
    this._localPeer.stream = null;

    this._remotePeers.forEach((peer: Peer) => {
      peer.onLocalStreamStopped();
    });

    // Broadcast event to all other peers
    this._socket.emit('stream_stopped');
  }

  public disconnect() {
    this.stopStreaming();

    this._socket.emit('leave');
  }

  public emit(messageType: string, data: any) {
    this._socket.emit(messageType, data);
  }

  private onPeerJoined(message: any) {
    // A peer has joined the room
    const {peerId, userName} = message;

    this.createPeer(peerId, userName);
  }

  private onPeerLeft(message: any) {
    // A peer has left the room
    const {peerId, userName} = message;

    this.removePeer(peerId);
  }

  private onRemoteStreamStarted(message: any) {
    // Another peer has started streaming
    const {peerId} = message;

    const peer = this.getPeer(peerId);
    if (peer != null) {
      peer.sendOfferForRemoteStream();
    } else {
      console.error('Got an offer from an unknown peer');
    }
  }

  private onRemoteStreamStopped(message: any) {
    // A peer has stopped streaming
    const {peerId} = message;

    const peer = this.getPeer(peerId);
    if (peer != null) {
      peer.onRemoteStreamStopped();

      // Stop active stream
      if (this.activePeer === peer) {
        this.activePeer = null;
      }
    }
  }

  private onOffer(message: any) {
    // Another peer has sent a peer connection offer
    const {peerId, data} = message;
    const sdp = data.sdp;

    const peer = this.getPeer(peerId);
    if (peer != null) {
      peer.sendAnswerForLocalStream(sdp, this._localPeer.stream);

      // TODO refuse if no local stream

    } else {
      console.error('Got an offer from an unknown peer');
    }
  }

  private onAnswer(message: any) {
    // Another peer has sent a peer connection answer
    const {peerId, data} = message;
    const sdp = data.sdp;

    const peer = this.getPeer(peerId);
    if (peer != null) {
      peer.onRemoteStreamAnswer(sdp);
    }
  }

  private onIceCandidate(message: any) {
    // Another peer has sent an ice candidate
    const {peerId, data} = message;
    const candidate = data.candidate;

    const peer = this.getPeer(peerId);
    if (peer != null) {
      peer.onRemoteIceCandidate(candidate);
    }
  }

  private getPeer(remotePeerId: string): Peer {
    return this._remotePeers.find(peer => peer.id === remotePeerId);
  }

  private createPeer(remotePeerId: string, userName: string): Peer {
    // Verify it doesn't already exist
    let peer: Peer = this.getPeer(remotePeerId);
    if (peer != null) {
      return peer;
    }

    peer = new Peer(remotePeerId, userName, this);
    this._remotePeers.push(peer);

    // Notify change to room participants
    this.createPeerList();

    return peer;
  }

  private removePeer(remotePeerId: string) {
    // Get peer associated with the Id
    const peer = this.getPeer(remotePeerId);
    if (peer != null) {
      // Remove active peer
      if (this.activePeer === peer) {
        this.activePeer = null;
      }

      // Remove peer from array
      this._remotePeers = this._remotePeers.filter(remotePeer => remotePeer.id !== remotePeerId);

      // Notify change to room participants
      this.createPeerList();
    }
  }

  private createPeerList() {
    this._peers = [this._localPeer].concat(this._remotePeers.map(peer => peer));
    this._peers$.next(this._peers);
  }
}
