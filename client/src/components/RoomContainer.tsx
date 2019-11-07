import React, {Component} from 'react';

import {Session} from './Session';
import {RoomService} from '../services';
import {Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<{ id: string }> {
}

export class RoomContainer extends Component<IProps, { room: Room, username: string }> {


  constructor(props: IProps) {
    super(props);
    this.state = {
      room: null,
      username: localStorage.getItem('username') || ''
    }
  }

  public componentDidMount() {
  }

  handleJoin() {
    const {id} = this.props.match.params;
    const roomService = new RoomService();

    const name = this.state.username;

    roomService.connect(id, name)
      .then(room => {
        this.setState({room})
      })
      .catch(error => {
        console.error('Error getting room: ', error);
      });
  }

  handleUsernameChange(event: any) {
    const username = event.target.value;
    this.setState({username: username});
    localStorage.setItem('username', username);
  }

  handleRoomDisconnect() {
    this.setState({room: null});
  }

  render() {
    if (this.state.room) {
      return (<Session room={this.state.room} onDisconnect={this.handleRoomDisconnect.bind(this)}/>);
    }
    return (<div className="room-join-wrapper">
              <div className="room-join-container">
                <div className="room-join-container-intro">
                  <img src={"/images/logo.svg"} />
                  <h2>
                    Welcome to officeshare</h2>
                </div>
                <div className="room-join-container-box">
                  <p className="room-join-container-box__help">
                    Before joining the room, please tell your us your name.
                  </p>
                  <div className="room-join-container-box__username">
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange.bind(this)} placeholder="Enter your name"/>
                  </div>
                  <div>
                    <button onClick={this.handleJoin.bind(this)} className="room-join-container-box__join" type="submit">
                      Join room
                    </button>
                  </div>
                </div>
              </div>
          </div>);
  }
}
