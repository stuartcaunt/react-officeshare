import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';

export class Participant extends Component<{ peer: Peer}, { stream: MediaStream }> {

  constructor(props: any) {
    super(props);
    this.state = {
      stream: null
    }
  }

  render() {
    const {peer} = this.props;
    return <div className="participant">
      {(this.state.stream == null) && <img src="/images/thumbnails/screen_ubuntu.png"/>}
      {(this.state.stream != null) && <Video stream={this.state.stream}/>}
      <div className="participant__user">
        <span className="participant__user__content">
          <span className="participant__user__username">{peer.userName}</span>
          <span
            className="participant__user__status participant__user__status--online">
            <i className="fa fa-circle"/>
          </span>
        </span>
      </div>
    </div>
  }

}