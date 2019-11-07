import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';
import Fullscreen from "react-full-screen";

export class Screen extends Component<{ presenter: Peer, fullScreen: boolean, onExitFullScreenHandler: () => void }, {}> {

  constructor(props: { presenter: Peer , fullScreen: boolean, onExitFullScreenHandler: () => void}) {
    super(props);
  }

  renderBlankSlate() {
    return (
      <div className="screen__blankslate">
        <div className={"icon"}/>
        <h2 className="title">Waiting for a participant to broadcast their screen</h2>
        <p>Use the buttons below to share your screen and become the presenter</p>
      </div>);
  }

  renderVideo(presenter: Peer) {
    const {stream} = presenter;
    return (<Video stream={stream}/>);
  }

  render() {
    const {presenter} = this.props;
    return (<div className="screen">
      <Fullscreen
        enabled={this.props.fullScreen}
        onChange={isFull => {
          if (!isFull) {
            this.props.onExitFullScreenHandler();
          }
        }}
      >
      {presenter ? this.renderVideo(presenter) : this.renderBlankSlate()};
      </Fullscreen>
    </div>);
  }
}

