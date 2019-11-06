import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';

export class Participant extends Component<{ peer: Peer }, { stream: MediaStream }> {

  constructor(props: { peer: Peer }) {
    super(props);
    this.state = {
      stream: null
    }
  }

  public componentDidMount() {
    const {peer} = this.props;
    peer.stream$.subscribe(stream => {
      this.setState({
        stream: stream
      });
    });
  }

  render() {
    const {peer} = this.props;
    const {stream} = this.state;
    return (<div className="participant">
      {(stream == null) && <img src="/images/stop-screen-share.png"/>}
      {(stream != null) && <Video stream={this.state.stream}/>}
      <div className="participant__user">
        <span className="participant__user__content">
          <span className="participant__user__username">{peer.userName}</span>
          <span
            className="participant__user__status participant__user__status--online">
            <i className="fa fa-circle"/>
          </span>
        </span>
      </div>
    </div>);
  }

}