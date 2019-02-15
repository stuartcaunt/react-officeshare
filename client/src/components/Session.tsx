import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Chat, Header, Information, Participants, Screen, Toolbar} from '.';
import {RoomService} from '../services';
import {Peer, Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<{ id: string }> {
}

export class Session extends Component<{room: Room}, { isChatHidden: boolean, participants: Array<Peer>, presenter: Peer }> {

  constructor(props: { room: Room }) {
    super(props);
    this.state = {
      isChatHidden: false,
      participants: props.room.peers,
      presenter: props.room.activePeer
    };
    this.handleChatToggle = this.handleChatToggle.bind(this);
  }


  public componentDidMount() {

    this.props.room.peers$.subscribe(peers => {
      this.setState({
        participants: peers
      });
    });

    this.props.room.activePeer$.subscribe(peer => {
      this.setState({
        presenter: peer
      })
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

  render() {
    return (
      <div className="container">
        <ToastContainer/>
        <Header participants={20} title={"My room 1"} toggleChat={this.handleChatToggle}/>
        <div className="content">
          <Participants participants={this.state.participants}/>
          <div className="viewer">
            <Screen presenter={this.state.presenter}/>
            <Toolbar/>
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