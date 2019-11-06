import React, {Component} from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Chat, Header, Participants, Screen, Toolbar} from '.';
import {Peer, Room, ToolbarAction} from '../models';
import {ApplicationState, withApplicationContext} from '../context';

class Session extends Component<{ room: Room, onDisconnect: () => void, applicationState: ApplicationState }, { isChatHidden: boolean, participants: Array<Peer>, localPeer: Peer, presenter: Peer, isFullScreen: boolean, toolbarActions: ToolbarAction[] }> {

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
      id: 'share',
      icon: 'share',
      label: 'Share my screen',
      handler: this.handleShareAction.bind(this),
      enabled: true,
      visible: true
    }), 
    new ToolbarAction({
      id: 'unshare',
      icon: 'share',
      label: 'Stop sharing',
      handler: this.handleStopSharingAction.bind(this),
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

  constructor(props: { room: Room, onDisconnect: () => void, applicationState: ApplicationState }) {
    super(props);

    this.state = {
      isFullScreen: false,
      isChatHidden: false,
      participants: props.room.peers,
      localPeer: props.room.localPeer,
      presenter: props.room.activePeer,
      toolbarActions: this._toolbarActions
    };

    this.handleChatToggle = this.handleChatToggle.bind(this);
  }

  public componentDidMount() {
    const {room, applicationState} = this.props;
    applicationState.localPeer = room.localPeer;
    room.peers$.subscribe(peers => {
      this.setState({
        participants: peers
      });
      applicationState.participants = peers;
    });

    room.activePeer$.subscribe(peer => {
      this.setState({
        presenter: peer
      });
      applicationState.presenter = peer;
    });
  }

  /**
   * Toggle showing and hiding chat
   */
  handleChatToggle(): void {
    this.setState(prevState => ({
      isChatHidden: !prevState.isChatHidden
    }));
  }

  /**
   * Check if the browser supports screen sharing natively
   */
  private isBrowserSupported() {
    const mediaDevices: any = navigator.mediaDevices;
    return typeof mediaDevices.getDisplayMedia === 'function';
  }

  handleFullScreenAction() {
    console.log('Entering full screen');
    this.setState({isFullScreen: true});
  }

  handleShareAction() {
    const room = this.props.room;
    if (room.localPeer.stream == null) {
      const mediaDevices: any = navigator.mediaDevices;
      const constraints = {video: true};
      if (this.isBrowserSupported()) {
        mediaDevices.getDisplayMedia(constraints)
          .then((stream: MediaStream) => {
            room.startStreaming(stream);
            toast.success('You are now sharing your screen');
            stream.oninactive = () => {
              if (room.localPeer.stream != null) {
                toast.success('You have stopped sharing your screen');

                this.handleStopSharingAction();
              }
            }

            this._toolbarActions.find(action => action.id === 'share').visible = false;
            this._toolbarActions.find(action => action.id === 'unshare').visible = true;
            this.setState({toolbarActions: this._toolbarActions});

          })
          .catch((error: Error) => {
            toast.error('You have decided not to share your screen.');
            console.log('error streaming ', error);
          });
      } else {
        toast.error("Your browser is not supported. Please upgrade to the latest version of Firefox or Chrome.")
      }
    } else {
      room.stopStreaming();
    }
  }

  handleStopSharingAction() {
    const room = this.props.room;
    room.stopStreaming();

    toast.success('You have stopped sharing your screen.');

    this._toolbarActions.find(action => action.id === 'share').visible = true;
    this._toolbarActions.find(action => action.id === 'unshare').visible = false;
    this.setState({toolbarActions: this._toolbarActions});
  }

  handleLeaveAction() {
    const room = this.props.room;
    room.disconnect();
    this.props.onDisconnect();
  }

  renderChat() {
    const {isChatHidden} = this.state;
    if (isChatHidden) {
      return (<Chat/>);
    }
    return null;
  }

  onExitFullScreen() {
    console.log('Exiting full screen');
    this.setState({isFullScreen: false});
  }

  render() {
    return (
      <div className="container">
        <Header link={"http://officeshare.com/123"} title={this.props.room.name} toggleChat={this.handleChatToggle}/>
        <div className="content">
          <Participants participants={this.state.participants} localPeer={this.state.localPeer}/>
          <div className="viewer">
            <Screen fullScreen={this.state.isFullScreen} presenter={this.state.presenter} onExitFullScreenHandler={this.onExitFullScreen.bind(this)}/>
            <Toolbar actions={this.state.toolbarActions}/>
            {/*<Information/>*/}
          </div>
          {this.renderChat()}
        </div>
      </div>
    );
  }
}

export default withApplicationContext(Session);