import React, {Component} from 'react';

import {Session} from './Session';
import {RoomService} from '../services';
import {Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<{ id: string }> {
}

export class RoomContainer extends Component<IProps, { room: Room, roomName: string, username: string, isRoomKnown: boolean }> {


  constructor(props: IProps) {
    super(props);

    const {id} = this.props.match.params;

    this.state = {
      room: null,
      roomName: '',
      username: localStorage.getItem('username') || '',
      isRoomKnown: (id != null)
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

  handleUserNameChange(event: any) {
    const username = event.target.value;
    this.setState({username: username});
    localStorage.setItem('username', username);
  }

  handleRoomNameChange(event: any) {
    const roomName = event.target.value;
    this.setState({roomName: roomName});
  }

  handleRoomDisconnect() {
    this.setState({room: null});
  }

  renderRoomNameInput() {
    const {id} = this.props.match.params;

    if (id == null) {
      return <div>
        <p className="room-join-container-box__help">You are about to create a new room: please enter a room name.</p>
        <div className="room-join-container-box__username">
          <input type="text" value={this.state.roomName} onChange={this.handleUserNameChange.bind(this)} placeholder="Enter room name"/>
        </div>
      </div>;
    } else {
      return;
    }
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
                  {this.renderRoomNameInput()}
                  <p className="room-join-container-box__help">
                    Before joining the room, please tell your us your name.
                  </p>
                  <div className="room-join-container-box__username">
                    <input type="text" value={this.state.username} onChange={this.handleUserNameChange.bind(this)} placeholder="Enter your name"/>
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
