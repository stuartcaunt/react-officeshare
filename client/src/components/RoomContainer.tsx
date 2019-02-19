import React, {Component} from 'react';

import Session from './Session';
import {RoomService} from '../services';
import {Room} from '../models';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<{ id: string }> {
}

class RoomContainer extends Component<IProps, { room: Room }> {


  constructor(props: IProps) {
    super(props);
    this.state = {
      room: null
    }
  }


  public componentDidMount() {
  }


  handleJoin() {
    const {id} = this.props.match.params;
    const roomService = new RoomService();

    const names =
      ['Raelene Mattice',
        'Kirk Kirschner',
        'Rosaura Borquez',
        'Livia Clowers',
        'Rocky Goding',
        'Yu Yamamoto',
        'Antonietta Brossard',
        'Kip Harsch',
        'Priscilla Covert',
        'Jone Tansey',
        'Felicia Allington',
        'Morton Brumsey',
        'Ethan Reidy',
        'Marhta Demeritt',
        'Tracie Stine',
        'Agustin Oxley',
        'Pattie Benn',
        'Kalyn Zack',
        'Fidelia Rady',
        'Tatum Almaguer'];

    roomService.connect(id, names[Math.floor(Math.random() * names.length)])
      .then(room => {
        this.setState({room})
      })
      .catch(error => {
        console.error('Error getting room: ', error);
      });
  }


  render() {
    if (this.state.room) {
      return (<Session room={this.state.room}/>);
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
                    <input type="text" value="Jamie (ILL)" />
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


  export default RoomContainer;
