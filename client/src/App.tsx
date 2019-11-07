import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.scss';
import {RoomContainer} from "./components/RoomContainer";
import {HomeContainer} from "./components";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class App extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <ToastContainer/>
        <Router>
          <div>
            <Route exact path="/" component={HomeContainer}/>
            <Route exact path="/:id" component={RoomContainer}/>
          </div>
        </Router>
      </div>
    );
  }

}


export default App;
