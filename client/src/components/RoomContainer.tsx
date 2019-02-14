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

    roomService.connect(id, 'test')
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
