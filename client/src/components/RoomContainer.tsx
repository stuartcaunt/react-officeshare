import React, {Component} from 'react';

import {Session} from '.';
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
    return (<button onClick={this.handleJoin.bind(this)}>Join</button>);
  }
}


export default RoomContainer;
