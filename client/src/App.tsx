import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.scss';
import RoomContainer from "./components/RoomContainer";
import {HomeContainer} from "./components";
import {ApplicationContext, INITIAL_APPLICATION_STATE} from './context';

class App extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <ApplicationContext.Provider value={INITIAL_APPLICATION_STATE}>
        <Router>
          <div>
            <Route exact path="/" component={HomeContainer}/>
            <Route exact path="/:id" component={RoomContainer}/>
          </div>
        </Router>
      </ApplicationContext.Provider>
    );
  }

}


export default App;
