import React, {Component} from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Chat, Header, Information, Participants, Screen, Toolbar} from '.';
import {Peer, Room} from '../models';
import {ApplicationState, withApplicationContext} from '../context';

class Session extends Component<{room: Room, applicationState: ApplicationState}, { isChatHidden: boolean, participants: Array<Peer>, presenter: Peer }> {

  constructor(props: { room: Room, applicationState: ApplicationState }) {
    super(props);
    this.state = {
      isChatHidden: false,
      participants: props.room.peers,
      presenter: props.room.activePeer
    };

    this.handleChatToggle = this.handleChatToggle.bind(this);
  }


  public componentDidMount() {
    this.props.applicationState.localPeer = this.props.room.localPeer;

    this.props.room.peers$.subscribe(peers => {
      this.setState({
        participants: peers
      });
      this.props.applicationState.participants = peers;
    });

    this.props.room.activePeer$.subscribe(peer => {
      this.setState({
        presenter: peer
      });
      this.props.applicationState.presenter = peer;
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

  handleToolbarAction(action: string) {
    const room = this.props.room;

    console.log('Clicked action', action);
    if (action === 'share'){
      if (room.localPeer.stream == null) {
        const mediaDevices: any = navigator.mediaDevices;
        mediaDevices.getDisplayMedia({ video: true })
          .then((stream: MediaStream) => {
            room.startStreaming(stream);

            stream.oninactive = () => {
              if (room.localPeer.stream != null) {
                room.stopStreaming();
              }
            }
          })
          .catch((error: Error) => {
            console.log('error streaming ', error);
          });

      } else {
        room.stopStreaming();
      }
    }
  }

  render() {
    return (
      <div className="container">
        <ToastContainer/>
        <Header participants={20} title={"My room 1"} toggleChat={this.handleChatToggle}/>
        <div className="content">
          <Participants participants={this.state.participants}/>
          <div className="viewer">
            <Screen presenter={this.state.presenter}/>
            <Toolbar actionHandler={this.handleToolbarAction.bind(this)}/>
            <Information/>
          </div>
          {this.state.isChatHidden == true &&
          <Chat/>
          }
        </div>
      </div>
    );
  }
}

export default withApplicationContext(Session);