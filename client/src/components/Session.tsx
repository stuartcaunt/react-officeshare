import React, {Component} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Chat, Header, Information, Participants, Screen, Toolbar} from '.';
import {Peer, Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';
import {ApplicationContext, ApplicationContextConsumer} from '../context';

interface IProps extends RouteComponentProps<{ id: string }> {
}

export class Session extends Component<{room: Room}, { isChatHidden: boolean, participants: Array<Peer>, presenter: Peer }> {

  private _context: ApplicationContext;

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
    this._context.actions.room = this.props.room;
    this._context.state.localPeer = this.props.room.localPeer;

    this.props.room.peers$.subscribe(peers => {
      this.setState({
        participants: peers
      });
      this._context.state.participants = peers;
    });

    this.props.room.activePeer$.subscribe(peer => {
      this.setState({
        presenter: peer
      });
      this._context.state.presenter = peer;
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
      <ApplicationContextConsumer>
        {context => {
          this._context = context;
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
          )
        }}
      </ApplicationContextConsumer>
    );
  }
}