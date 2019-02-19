import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';

export class Screen extends Component<{presenter: Peer}, {}> {

  constructor(props: { presenter: Peer }) {
    super(props);

  }

  render() {
    return <div className="screen">
      {(this.props.presenter == null) && <img src="/images/os.jpeg"/>}
      {(this.props.presenter != null) && <Video stream={this.props.presenter.stream}/>}
    </div>
  }

}

