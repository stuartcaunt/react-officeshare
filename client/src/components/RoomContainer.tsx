import React, {Component} from 'react';

import {Session} from './Session';
import {RoomService} from '../services';
import {Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';
import {ApplicationState, withApplicationContext} from '../context';

interface IProps extends RouteComponentProps<{ id: string }> {
}

class RoomContainer extends Component<IProps & {applicationState: ApplicationState}, { room: Room, roomName: string, username: string }> {

  constructor(props: IProps & {applicationState: ApplicationState}) {
    super(props);

    this.state = {
      room: null,
      roomName: '',
      username: localStorage.getItem('username') || ''
    }
  }

  public componentDidMount() {
    const {applicationState} = this.props;
    this.setState({room: applicationState.room});
  }

  handleJoin() {
    const {id} = this.props.match.params;
    const roomService = new RoomService();

    const username = this.state.username;
    const roomName = this.state.roomName;

    const history = this.props.history;

    roomService.connect(roomName, id, username)
    .then(room => {
      this.setRoom(room);

      if (id == null) {
        history.push({
          pathname: `/${room.id}`,
          state: {
            roomName: roomName,
            username: username
          }
        });
      }
    })
    .catch(error => {
      console.error('Error getting room: ', error);
      history.push({pathname: '/'});
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
    this.setRoom(null);
  }

  setRoom(room: Room) {
    this.setState({room: room});
    this.props.applicationState.room = room;
  }

  renderRoomNameInput() {
    const {id} = this.props.match.params;

    if (id == null) {
      return <div>
        <p className="room-join-container-box__help">You are about to create a new room. Please enter a room name.</p>
        <div className="room-join-container-box__username">
          <input type="text" value={this.state.roomName} onChange={this.handleRoomNameChange.bind(this)} placeholder="Enter room name"/>
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
                  <img src={"/images/logo.svg"} alt="logo"/>
                  <h2>Welcome to officeshare</h2>
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

export default withApplicationContext(RoomContainer);
