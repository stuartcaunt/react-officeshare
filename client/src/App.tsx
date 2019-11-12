import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.scss';
import {RoomContainer} from "./components";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class App extends Component<{}, {}> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} 
                        closeOnClick={true}
                        hideProgressBar={true} />
        <Router>
          <div>
            <Route exact path="/" component={RoomContainer}/>
            <Route exact path="/:id" component={RoomContainer}/>
          </div>
        </Router>
      </div>
    );
  }

}


export default App;
