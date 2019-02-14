import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Chat, Header, Information, Participants, Screen, Toolbar} from '.';
import {RoomService} from '../services';
import {Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<{ id: string }> {
}

export class Session extends Component<{ room: Room }, { isChatHidden: boolean }> {

  constructor(props: { room: Room }) {
    super(props);
    this.state = {
      isChatHidden: false
    };
    this.handleChatToggle = this.handleChatToggle.bind(this);
  }


  public componentDidMount() {
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
          <Participants participants={this.props.room.remotePeers$}/>
          <div className="viewer">
            <Screen/>
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