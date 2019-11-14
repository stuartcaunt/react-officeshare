import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.scss';
import RoomContainer from "./components/RoomContainer";
import {ApplicationContext, INITIAL_APPLICATION_BUNDLE} from './context';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class App extends Component<{}, {}> {

  render() {
    return (
      <ApplicationContext.Provider value={INITIAL_APPLICATION_BUNDLE}>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} 
                        closeOnClick={true}
                        hideProgressBar={true} />
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
