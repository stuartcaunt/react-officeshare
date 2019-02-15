import React, {Component} from 'react';
import {Room} from '../models';

export class Toolbar extends Component<{room: Room}, {}> {

  constructor(props: { room: Room }) {
    super(props);
  }

  private handleAction(action: string) {
    console.log('Clicked action', action);
    if (action === 'share'){
      if (this.props.room.localPeer.stream == null) {
        const mediaDevices: any = navigator.mediaDevices;
        mediaDevices.getDisplayMedia({ video: true })
          .then((stream: MediaStream) => {
            this.props.room.startStreaming(stream);

            stream.oninactive = () => {
              if (this.props.room.localPeer.stream != null) {
                this.props.room.stopStreaming();
              }
            }
          })
          .catch((error: Error) => {
            console.log('error streaming ', error);
          });

      } else {
        this.props.room.stopStreaming();
      }
    }
  }

  /**
   * Render an action
   * @param icon the icon to use for this action
   * @param action the name of the action
   */
  renderAction(icon: string, action: string) {
    return <li className="action-item" role="presentation">
      <a className={`action-label icon actions ${icon}`}
         role="button"
         onClick={() => this.handleAction(action)}/>
    </li>;
  }

  render() {
    return <div className="toolbar">
      <div className="action-bar">
        <ul className="actions-container" role="toolbar">
          {this.renderAction('full-screen', 'full-screen')}
          {this.renderAction('microphone', 'microphone')}
          {this.renderAction('share', 'share')}
          {this.renderAction('leave', 'leave')}
          {this.renderAction('settings', 'settings')}
        </ul>
      </div>
    </div>
  }

}

