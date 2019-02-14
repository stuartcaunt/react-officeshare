import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import './App.scss';
import RoomContainer from "./components/RoomContainer";
import {HomeContainer} from "./components";

class App extends Component<{}, {}> {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeContainer}/>
          <Route exact path="/:id" component={RoomContainer}/>
        </div>
      </Router>
    );
  }

}


export default App;
