import React, {Component} from 'react';
import './App.scss';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Chat, Header, Information, Participants, Screen, Toolbar} from './components';
import {RoomService} from './services';
import {Room} from './models';

class App extends Component<{}, { isChatHidden: boolean }> {

  private _room: Room;

  constructor(props: any) {
    super(props);
    this.state = {
      isChatHidden: false
    };
    this.handleChatToggle = this.handleChatToggle.bind(this);
    const roomService = new RoomService();

    roomService.connect('default', 'test')
      .then(room => {
        this._room = room;
      })
      .catch(error => {
        console.error('Error getting room: ', error);
      });
  }


  public componentDidMount() {

    // const icon = <span><i aria-hidden="true" className="fas fa-door-open"/> Stuart caunt has entered the room</span>
    //
    //
    // toast.success(icon, {
    //   autoClose: 2000,
    //   hideProgressBar: true,
    // });
    //
    // toast.success("Stuart Caunt is now broadcasting his screen", {
    //   progress: 0,
    // });
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
          <Participants participants={['Jamie Hall', 'Stuart Caunt', 'Joe Bloggs']}/>
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


export default App;
