import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';

export class Participant extends Component<{ peer: Peer, onParticipantClick: (peer: Peer) => void}, { stream: MediaStream, isPresenter: boolean }> {

  constructor(props: { peer: Peer, onParticipantClick: (peer: Peer) => void }) {
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

  private onParticipantClick() {
    if (this.state.stream != null) {
      this.props.onParticipantClick(this.props.peer);
    }
  }

  render() {
    const {peer} = this.props;
    const {stream, isPresenter} = this.state;
    return (<div className={`participant ${this.state.stream == null ? '' : 'participant-selectable'}`} onClick={this.onParticipantClick.bind(this)}>
      {(stream == null) && <img src="/images/stop-desktop-share-inverted.png" alt="share"/>}
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