import React, {Component} from 'react';
import {Chat, Header, Participants, Screen, Toolbar, Modal} from '.';
import {Peer, Room, ToolbarAction, ChatMessage} from '../models';
import { Subscription } from 'rxjs';
import { store } from 'react-notifications-component';

export class Session extends Component<{ room: Room, onDisconnect: () => void }, { isChatHidden: boolean, participants: Array<Peer>, unreadChatMessages: number, chatMessages: Array<ChatMessage>, localPeer: Peer, presenter: Peer, isFullScreen: boolean, toolbarActions: ToolbarAction[], presenterModalVisible: boolean }> {

    /**
     * A list of actions for the toolbar
     */
    private _toolbarActions = [
    new ToolbarAction({
      id: 'full-screen',
      icon: 'full-screen',
      label: 'Full screen',
      handler: this.handleFullScreenAction.bind(this),
      enabled: true,
      visible: true
    }),
    new ToolbarAction({
      id: 'follow',
      icon: 'follow',
      label: 'Follow',
      handler: this.startFollowing.bind(this),
      enabled: true,
      visible: false
    }), 
    new ToolbarAction({
      id: 'stop-follow',
      icon: 'stop-follow',
      label: 'Stop following',
      handler: this.stopFollowing.bind(this),
      enabled: true,
      visible: true
    }), 
    new ToolbarAction({
      id: 'share',
      icon: 'share',
      label: 'Share my screen',
      handler: this.handleShareAction.bind(this),
      enabled: true,
      visible: true
    }), 
    new ToolbarAction({
      id: 'unshare',
      icon: 'stop-share',
      label: 'Stop sharing',
      handler: this.handleStopSharingAction.bind(this),
      enabled: true,
      visible: false
    }),
    new ToolbarAction({
      id: 'present',
      icon: 'present',
      label: 'Present',
      handler: this.startPresenting.bind(this),
      enabled: true,
      visible: false
    }), 
    new ToolbarAction({
      id: 'stop-present',
      icon: 'stop-present',
      label: 'Stop Presenting',
      handler: this.stopPresenting.bind(this),
      enabled: true,
      visible: false
    }), 
    new ToolbarAction({
      id: 'leave',
      icon: 'leave',
      label: 'Leave room',
      handler: this.handleLeaveAction.bind(this),
      enabled: true,
      visible: true
    })
  ];

  private _peersSubscription: Subscription; 
  private _chatSubscription: Subscription; 
  private _activePeerSubscription: Subscription; 

  constructor(props: { room: Room, onDisconnect: () => void }) {
    super(props);

    this.state = {
      isFullScreen: false,
      isChatHidden: true,
      participants: props.room.peers,
      localPeer: props.room.localPeer,
      presenter: props.room.activePeer,
      toolbarActions: this._toolbarActions,
      presenterModalVisible: false,
      unreadChatMessages: 0,
      chatMessages: []
    };

    this.handleChatToggle = this.handleChatToggle.bind(this);
    this.closePresenterModal = this.closePresenterModal.bind(this);
    this.startPresentingFromModal = this.startPresentingFromModal.bind(this);
  }

  public componentDidMount() {
    const {room} = this.props;
    this._peersSubscription = room.peers$.subscribe(peers => {
      this.setState({
        participants: peers
      });
    });
    
    this._chatSubscription = room.chatMessages$.subscribe(messages => {
      if(messages.length > 0) {
        const {isChatHidden} = this.state;
        this.setState(prevState => ({
          ...prevState,
          chatMessages: messages,
          unreadChatMessages: isChatHidden ? prevState.unreadChatMessages + 1 : 0
        }));
        const lastMessage = messages[messages.length-1];
        if(!this.isLocalPeerUsername(lastMessage.userName)) {
          this.playNotification('chat-notification');
        }
      }
    });

    this._activePeerSubscription = room.activePeer$.subscribe(peer => {
      this._toolbarActions.find(action => action.id === 'present').visible = (peer !== this.state.localPeer && this.state.localPeer.stream !== null);
      this._toolbarActions.find(action => action.id === 'stop-present').visible = (peer === this.state.localPeer && this.state.localPeer.stream !== null);
      this.setState({
        presenter: peer,
        toolbarActions: this._toolbarActions
      });
    });
  }

  componentWillUnmount() {
    if (this._peersSubscription !== null) {
      this._peersSubscription.unsubscribe();
      this._peersSubscription = null;
    }
    if (this._chatSubscription !== null) {
      this._chatSubscription.unsubscribe();
      this._chatSubscription = null;
    }
    if (this._activePeerSubscription !== null) {
      this._activePeerSubscription.unsubscribe();
      this._activePeerSubscription = null;
    }
  }

  /**
   * Toggle showing and hiding chat
   */
  handleChatToggle(): void {
    this.setState(prevState => ({
      ...prevState,
      isChatHidden: !prevState.isChatHidden,
      unreadChatMessages: prevState.isChatHidden ? 0 : prevState.unreadChatMessages
    }));
  }

  private playNotification(notification: string): void  {
    const audio = new Audio(`sounds/${notification}.mp3`)
    audio.load()
    audio.play();
  }

  private isLocalPeerUsername(userName: string): boolean {
    const {room} = this.props;
    return room.localPeer.userName === userName;
  }

  /**
   * Check if the browser supports screen sharing natively
   */
  private isBrowserSupported() {
    const mediaDevices: any = navigator.mediaDevices;
    return typeof mediaDevices.getDisplayMedia === 'function';
  }

  private addNotification(message: string, type: string) {
    store.addNotification({
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: false
      }
    });
  }

  handleFullScreenAction() {
    console.log('Entering full screen');
    this.setState({isFullScreen: true});
  }

  handleShareAction() {
    const {room} = this.props;
    if (room.localPeer.stream == null) {
      const mediaDevices: any = navigator.mediaDevices;
      const constraints = {video: true};
      if (this.isBrowserSupported()) {
        mediaDevices.getDisplayMedia(constraints)
          .then((stream: MediaStream) => {
            room.startStreaming(stream);
            this.addNotification('You are now sharing your screen', 'success');
            stream.oninactive = () => {
              if (room.localPeer.stream != null) {
                this.handleStopSharingAction();
              }
            }

            this._toolbarActions.find(action => action.id === 'share').visible = false;
            this._toolbarActions.find(action => action.id === 'unshare').visible = true;
            this._toolbarActions.find(action => action.id === 'present').visible = true;
            this._toolbarActions.find(action => action.id === 'stop-present').visible = false;
            this.setState({toolbarActions: this._toolbarActions});

            this.openPresenterModal();
          })
          .catch((error: Error) => {
            this.addNotification('You have decided not to share your screen.', 'danger');
            console.log('error streaming ', error);
          });
      } else {
        this.addNotification("Your browser is not supported. Please upgrade to the latest version of Firefox or Chrome.", 'danger')
      }
    } else {
      room.stopStreaming();
    }
  }

  handleStopSharingAction() {
    const {room} = this.props;
    room.stopStreaming();

    this.addNotification('You have stopped sharing your screen', 'success');

    this._toolbarActions.find(action => action.id === 'share').visible = true;
    this._toolbarActions.find(action => action.id === 'unshare').visible = false;
    this._toolbarActions.find(action => action.id === 'present').visible = false;
    this._toolbarActions.find(action => action.id === 'stop-present').visible = false;
    this.setState({toolbarActions: this._toolbarActions});
  }

  startPresenting() {
    const {room} = this.props;
    
    this.startFollowing();

    room.startPresenting();

    this.addNotification('You have started presenting your screen', 'success');

    this._toolbarActions.find(action => action.id === 'present').visible = false;
    this._toolbarActions.find(action => action.id === 'stop-present').visible = true;
    this.setState({toolbarActions: this._toolbarActions});
  }

  stopPresenting() {
    const {room} = this.props;
    
    room.stopPresenting();
    this.addNotification('You have stopped presenting your screen', 'success');

    this._toolbarActions.find(action => action.id === 'present').visible = true;
    this._toolbarActions.find(action => action.id === 'stop-present').visible = false;
    this.setState({toolbarActions: this._toolbarActions});
  }

  startFollowing() {
    const {room} = this.props;
    room.followingPresenter = true;

    this._toolbarActions.find(action => action.id === 'follow').visible = false;
    this._toolbarActions.find(action => action.id === 'stop-follow').visible = true;
    this.setState({toolbarActions: this._toolbarActions});
  }

  stopFollowing() {
    const {room} = this.props;
    room.followingPresenter = false;

    this._toolbarActions.find(action => action.id === 'follow').visible = true;
    this._toolbarActions.find(action => action.id === 'stop-follow').visible = false;
    this.setState({toolbarActions: this._toolbarActions});
  }

  handleLeaveAction() {
    const {room} = this.props;
    room.disconnect();
    this.props.onDisconnect();
  }

  handleSendMessage(message: string) {
    const {room} = this.props;
    room.sendChatMessage(message);
  }

  renderChat() {
    const {isChatHidden, chatMessages,localPeer} = this.state;
    if (!isChatHidden) {
      return (
        <Chat messages={chatMessages} 
          userName={localPeer.userName}
          onSendMessage={this.handleSendMessage.bind(this)}
        />
      );
    }
    return null;
  }

  onExitFullScreen() {
    console.log('Exiting full screen');
    this.setState({isFullScreen: false});
  }

  openPresenterModal() {
    this.setState({
      presenterModalVisible : true
    });
  }

  closePresenterModal() {
    this.setState({
      presenterModalVisible : false
    });
  }

  startPresentingFromModal() {
    this.setState({
      presenterModalVisible : false
    });
    this.startPresenting();
  }

  onParticipantClick(peer: Peer) {
    const {room} = this.props;
    if (room.activePeer !== peer) {
      room.activePeer = peer;

      // Stop following presenter
      room.followingPresenter = false;

      this.stopFollowing();
    }
  }

  render() {
    return (
      <div className="container">
        <Header link={window.location.href} unreadChatMessages={this.state.unreadChatMessages} title={`${this.props.room.name} ${this.state.presenter != null ? '(' + this.state.presenter.userName + ')' : ''}`} toggleChat={this.handleChatToggle}/>
        <div className="content">
          <Participants participants={this.state.participants} localPeer={this.state.localPeer} onParticipantClick={this.onParticipantClick.bind(this)}/>
          <div className="viewer">
            <Screen fullScreen={this.state.isFullScreen} presenter={this.state.presenter} onExitFullScreenHandler={this.onExitFullScreen.bind(this)}/>
            <Toolbar actions={this.state.toolbarActions}/>
            {/*<Information/>*/}
          </div>
          {this.renderChat()}
          <Modal isVisible={this.state.presenterModalVisible}>
              <h3>Would you like to become the presenter?</h3>
              <div className="presenter-modal-buttons">
                <button onClick={this.startPresentingFromModal}>Yes</button>
                <button onClick={this.closePresenterModal}>No</button>
              </div>
            </Modal>
        </div>
      </div>
    );
  }
}
