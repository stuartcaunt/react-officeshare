import { Peer } from './Peer.model';
import { ChatMessage } from './ChatMessage.model';
import { BehaviorSubject } from 'rxjs';

export class Room {
  private _remotePeers: Array<Peer> = [];

  private _peers: Array<Peer> = [];
  private _peers$: BehaviorSubject<Array<Peer>> = new BehaviorSubject([]);
  private _localPeer: Peer = null;

  private _activePeer$: BehaviorSubject<Peer> = new BehaviorSubject<Peer>(null);
  private _presenter: Peer = null;
  private _folowingPresenter: boolean = true;

  private _chatMessages$: BehaviorSubject<Array<ChatMessage>> = new BehaviorSubject([]);


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

  set presenter(value: Peer) {
    if (this._presenter != null) {
      this._presenter.isPresenter = false;

      if (this.activePeer === this._presenter && this._folowingPresenter) {
        this.activePeer = null;
      }
    }

    this._presenter = value;

    if (this._folowingPresenter) {
      this.activePeer = this._presenter;
    }

    if (value != null) {
      value.isPresenter = true;
    }
  }

  get presenter(): Peer {
    return this._presenter;
  }

  get localPeer(): Peer {
    return this._localPeer;
  }

  get name(): string {
    return this._roomName;
  }

  get id(): string {
    return this._roomId;
  }

  get followingPresenter(): boolean {
    return this._folowingPresenter;
  }

  set followingPresenter(value: boolean) {
    this._folowingPresenter = value;
    if (this._folowingPresenter && this.activePeer !== this._presenter) {
      this.activePeer = this._presenter;
    }
  }

  get chatMessages$(): BehaviorSubject<Array<ChatMessage>> {
    return this._chatMessages$;
  }

  constructor(private _socket: SocketIOClient.Socket, peerDataArrays: Array<any>, presenterPeerId: string, private _roomId: string, private _roomName: string, private _userName: string) {

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
    this._socket.on('presenter_started', this.onPresenterStarted.bind(this));
    this._socket.on('presenter_stopped', this.onPresenterStopped.bind(this));
    this._socket.on('chat:message', this.onChatMessage.bind(this));
    // Store current peer
    peerDataArrays.forEach(peerData => {
      const peer = this.createPeer(peerData.id, peerData.userData.userName);

      // If peer is streaming then get remote stream
      if (peerData.userData.streaming) {
        peer.sendOfferForRemoteStream();
      }
    });

    if (presenterPeerId != null) {
      this.onPresenterStarted({ peerId: presenterPeerId });
    }
  }

  public startStreaming(stream: MediaStream) {
    this._localPeer.stream = stream;

    // Broadcast event to all other peers
    this._socket.emit('stream_started');
  }

  public stopStreaming() {
    // Update stream in local peer
    if (this._localPeer.stream != null) {
      this._localPeer.stream.getTracks()[0].stop();
      this._localPeer.stream = null;

      this._remotePeers.forEach((peer: Peer) => {
        peer.onLocalStreamStopped();
      });
  
      // Broadcast event to all other peers
      this._socket.emit('stream_stopped');
  
      // Check if presenting too
      if (this.activePeer === this.localPeer) {
        this.stopPresenting();
      }
    }
  }

  public startPresenting() {
    if (this._localPeer.stream != null) {
      // Update main stream
      this.presenter = this._localPeer;

      // Broadcast event to all other peers
      this._socket.emit('presenter_started');
    }
  }

  public stopPresenting() {
    if (this.presenter === this._localPeer) {
      this.presenter = null;

      // Broadcast event to all other peers
      this._socket.emit('presenter_stopped');
    }
  }

  public sendChatMessage(message: string) {
    this._socket.emit('chat:message', { message });
  }

  public disconnect() {
    this.stopStreaming();

    this._socket.emit('leave');

    this._socket.disconnect();
  }

  public emit(messageType: string, data: any) {
    this._socket.emit(messageType, data);
  }

  public onRemoteStreamReceived(peer: Peer) {
    if (this.activePeer === peer) {
      this.activePeer = peer;
    }
  }

  private onChatMessage(message: ChatMessage) {
    this._chatMessages$.next(this._chatMessages$.getValue().concat([message]));
  }

  private onPeerJoined(message: any) {
    // A peer has joined the room
    const { peerId, userName } = message;

    this.createPeer(peerId, userName);
  }

  private onPeerLeft(message: any) {
    // A peer has left the room
    const { peerId } = message;

    this.removePeer(peerId);
  }

  private onRemoteStreamStarted(message: any) {
    // Another peer has started streaming
    const { peerId } = message;

    const peer = this.getRemotePeer(peerId);
    if (peer != null) {
      peer.sendOfferForRemoteStream();
    } else {
      console.error('Got an offer from an unknown peer');
    }
  }

  private onRemoteStreamStopped(message: any) {
    // A peer has stopped streaming
    const { peerId } = message;

    const peer = this.getRemotePeer(peerId);
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
    const { peerId, data } = message;
    const sdp = data.sdp;

    const peer = this.getRemotePeer(peerId);
    if (peer != null) {
      peer.sendAnswerForLocalStream(sdp, this._localPeer.stream);

      // TODO refuse if no local stream

    } else {
      console.error('Got an offer from an unknown peer');
    }
  }

  private onAnswer(message: any) {
    // Another peer has sent a peer connection answer
    const { peerId, data } = message;
    const sdp = data.sdp;

    const peer = this.getRemotePeer(peerId);
    if (peer != null) {
      peer.onRemoteStreamAnswer(sdp);
    }
  }

  private onIceCandidate(message: any) {
    // Another peer has sent an ice candidate
    const { peerId, data } = message;
    const candidate = data.candidate;

    const peer = this.getRemotePeer(peerId);
    if (peer != null) {
      peer.onRemoteIceCandidate(candidate);
    }
  }

  private onPresenterStarted(message: any) {
    const { peerId } = message;
    const peer = this.getPeer(peerId);
    if (peer != null) {
      this.presenter = peer;
    }
  }

  private onPresenterStopped() {
    this.presenter = null;
  }

  private getPeer(peerId: string): Peer {
    return this._peers.find(peer => peer.id === peerId);
  }

  private getRemotePeer(remotePeerId: string): Peer {
    return this._remotePeers.find(peer => peer.id === remotePeerId);
  }

  private createPeer(remotePeerId: string, userName: string): Peer {
    // Verify it doesn't already exist
    let peer: Peer = this.getRemotePeer(remotePeerId);
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
    const peer = this.getRemotePeer(remotePeerId);
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
