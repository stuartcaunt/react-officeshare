import {Peer} from './Peer.model';

export class Room {
  private _peers: Map<string, Peer> = new Map<string, Peer>();
  private _localStream: MediaStream = null;

  constructor(private _socket: SocketIOClient.Socket, peerDataArrays: Array<any>, private _roomName: string, private _userName: string) {

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
      const peer = this.getOrCreatePeer(peerData.id);

      // If peer is streaming then get remote stream
      if (peerData.userdata.streaming) {
        peer.sendOfferForRemoteStream();
      }
    });

    // TODO set an observable for the peers
  }

  public startStreaming(stream: MediaStream) {
    this._localStream = stream;

    // Broadcast event to all other peers
    this._socket.emit('stream_started');

    // TODO set an observable for local streaming started
  }

  public stopStreaming() {
    this._localStream = null;

    this._peers.forEach((peer: Peer, peerId: string) => {
      peer.onLocalStreamStopped();
    });

    // Broadcast event to all other peers
    this._socket.emit('stream_stopped');

    // TODO set an observable for local streaming stopped
  }


  private onPeerJoined(message: any) {
    // TODO

    // TODO set an observable for the peers
  }

  private onPeerLeft(message: any) {
    // TODO

    // TODO set an observable for the peers
  }

  private onRemoteStreamStarted(message: any) {
    // Another peer has started streaming
    const {peerId} = message;

    const peer = this.getOrCreatePeer(peerId);
    peer.sendOfferForRemoteStream();
  }

  private onRemoteStreamStopped(message: any) {
    // A peer has stopped streaming
    const {peerId} = message;

    const peer = this._peers.get(peerId);
    if (peer != null) {
      peer.onRemoteStreamStopped();
    }
  }

  private onOffer(message: any) {
    // Another peer has sent a peer connection offer
    const {peerId, data} = message;
    const sdp = data.sdp;

    const peer = this.getOrCreatePeer(peerId);
    peer.sendAnswerForLocalStream(sdp, this._localStream);

    // TODO refuse if no local stream
  }

  private onAnswer(message: any) {
    // Another peer has sent a peer connection answer
    const {peerId, data} = message;
    const sdp = data.sdp;

    const peer = this._peers.get(peerId);
    if (peer != null) {
      peer.onRemoteStreamAnswer(sdp);
    }
  }

  private onIceCandidate(message: any) {
    // Another peer has sent an ice candidate
    const {peerId, data} = message;
    const candidate = data.candidate;

    const peer = this._peers.get(peerId);
    if (peer != null) {
      peer.onRemoteIceCandidate(candidate);
    }
  }

  private getOrCreatePeer(remotePeerId: string): Peer {
    let peer: Peer = this._peers.get(remotePeerId);
    if (this._peers.get(remotePeerId) != null) {
      return peer;
    }

    peer = new Peer(this._socket, remotePeerId);
    this._peers.set(remotePeerId, peer);

    return peer;
  }
}
