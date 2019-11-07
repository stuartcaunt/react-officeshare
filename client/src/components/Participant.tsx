import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';

export class Participant extends Component<{ peer: Peer }, { stream: MediaStream, isPresenter: boolean }> {

  constructor(props: { peer: Peer }) {
    super(props);
    this.state = {
      stream: null,
      isPresenter: false
    }
  }

  public componentDidMount() {
    const {peer} = this.props;
    peer.stream$.subscribe(stream => {
      this.setState({
        stream: stream
      });
    });
    peer.isPresenter$.subscribe(isPresenter => {
      this.setState({
        isPresenter: isPresenter
      });
    });
  }

  render() {
    const {peer} = this.props;
    const {stream, isPresenter} = this.state;
    return (<div className="participant">
      {(stream == null) && <img src="/images/stop-desktop-share-inverted.png"/>}
      {(stream != null) && <Video stream={this.state.stream}/>}
      <div className="participant__user">
        <span className="participant__user__content">
          <span className="participant__user__username">{peer.userName}</span>
          {(isPresenter) && <span className="participant__user__status participant__user__status--online">
            <i className="fa fa-circle"/>
          </span>}
        </span>
      </div>
    </div>);
  }

}