import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.scss';
import RoomContainer from "./components/RoomContainer";
import {HomeContainer} from "./components";
import {ApplicationContext, INITIAL_APPLICATION_STATE} from './context';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class App extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <ApplicationContext.Provider value={INITIAL_APPLICATION_STATE}>
        <ToastContainer/>
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
