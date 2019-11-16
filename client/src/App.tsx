import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.scss';
import RoomContainer from "./components/RoomContainer";
import {ApplicationContext, INITIAL_APPLICATION_BUNDLE} from './context';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'


class App extends Component<{}, {}> {

  render() {
    return (
      <ApplicationContext.Provider value={INITIAL_APPLICATION_BUNDLE}>
        <ReactNotification />
        <Router>
          <div>
            <Route exact path="/" component={RoomContainer}/>
            <Route exact path="/:id" component={RoomContainer}/>
          </div>
        </Router>
      </ApplicationContext.Provider>
    );
  }

}


export default App;
