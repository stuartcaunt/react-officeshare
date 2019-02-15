import React, {Component} from 'react';
import {Peer} from '../models';
import {Video} from './Video';

export class Screen extends Component<{presenter: Peer}, {}> {

  constructor(props: { presenter: Peer }) {
    super(props);

  }

  render() {
    return <div className="screen">
      <div className="debug-toolbar">
        <div className="action-bar">
          <ul className="actions-container" role="toolbar">
            <li className="action-item" role="presentation">
              <a className="action-label icon debug-action screenshot" role="button"/>
            </li>
            <li className="action-item" role="presentation">
              <a className="action-label icon debug-action microphone" role="button"/>
            </li>
            <li className="action-item" role="presentation">
              <a className="action-label icon debug-action clipboard" role="button"/>
            </li>
            <li className="action-item" role="presentation">
              <a className="action-label icon debug-action settings" role="button"/>
            </li>
            <li className="action-item" role="presentation">
              <a className="action-label icon debug-action exit-full-screen"
                 role="button"/>
            </li>
          </ul>
        </div>
      </div>
      {(this.props.presenter == null) && <img src="https://www.ghacks.net/wp-content/uploads/2018/03/Elementary-Applications-Menu.jpeg"/>}
      {(this.props.presenter != null) && <Video stream={this.props.presenter.stream}/>}
    </div>
  }

}

