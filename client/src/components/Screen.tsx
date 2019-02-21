import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';
import Fullscreen from "react-full-screen";

export class Screen extends Component<{ presenter: Peer, fullScreen: boolean }, {}> {

  constructor(props: { presenter: Peer , fullScreen: boolean}) {
    super(props);

  }

  renderBlankSlate() {
    return (
      <div className="screen__blankslate">
        <div className={"icon"}/>
        <h2 className="title">Waiting for a participant to broadcast their screen</h2>
        <p>Use the button below to become the presenter</p>
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
      >
      {presenter ? this.renderVideo(presenter) : this.renderBlankSlate()};
      </Fullscreen>
    </div>);
  }
}

