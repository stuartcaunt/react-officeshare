import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import './App.scss';
import RoomContainer from "./components/RoomContainer";
import {HomeContainer} from "./components";
import {ApplicationContextProvider, INITIAL_APPLICATION_CONTEXT} from './context';
import {ApplicationState} from './context/Application.state';

class App extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <ApplicationContextProvider value={INITIAL_APPLICATION_CONTEXT}>
        <Router>
          <div>
            <Route exact path="/" component={HomeContainer}/>
            <Route exact path="/:id" component={RoomContainer}/>
          </div>
        </Router>
      </ApplicationContextProvider>
    );
  }

}


export default App;
