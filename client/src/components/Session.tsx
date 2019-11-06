import React, {Component} from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Chat, Header, Participants, Screen, Toolbar} from '.';
import {Peer, Room} from '../models';
import {ApplicationState, withApplicationContext} from '../context';

class Session extends Component<{ room: Room, onDisconnect: () => void, applicationState: ApplicationState }, { isChatHidden: boolean, participants: Array<Peer>, localPeer: Peer, presenter: Peer, isFullScreen: boolean }> {

  constructor(props: { room: Room, onDisconnect: () => void, applicationState: ApplicationState }) {
    super(props);
    this.state = {
      isFullScreen: false,
      isChatHidden: false,
      participants: props.room.peers,
      localPeer: props.room.localPeer,
      presenter: props.room.activePeer
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

  handleToolbarAction(action: string) {
    const room = this.props.room;
    if (action === 'full-screen') {
      console.log('Entering full screen');
      this.setState({isFullScreen: true});
    
    } else  if (action === 'share') {
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
                  room.stopStreaming();
                }
              }
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
    
    } else if (action === 'leave') {
      room.disconnect();
      this.props.onDisconnect();
    }
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
        <Header link={"http://officeshare.com/123"} title={"My room 1"} toggleChat={this.handleChatToggle}/>
        <div className="content">
          <Participants participants={this.state.participants} localPeer={this.state.localPeer}/>
          <div className="viewer">
            <Screen fullScreen={this.state.isFullScreen} presenter={this.state.presenter} onExitFullScreenHandler={this.onExitFullScreen.bind(this)}/>
            <Toolbar actionHandler={this.handleToolbarAction.bind(this)}/>
            {/*<Information/>*/}
          </div>
          {this.renderChat()}
        </div>
      </div>
    );
  }
}

export default withApplicationContext(Session);