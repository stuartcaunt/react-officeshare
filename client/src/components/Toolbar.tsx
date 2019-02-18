import React, {Component, Context} from 'react';
import {ApplicationContext, ApplicationContextConsumer, ApplicationState} from '../context';

export class Toolbar extends Component<{}, {}> {

  constructor(props: {}) {
    super(props);
  }

  private handleAction(context: ApplicationContext, action: string) {
    console.log('Clicked action', action);
    if (action === 'share'){
      if (context.state.localPeer.stream == null) {
        const mediaDevices: any = navigator.mediaDevices;
        mediaDevices.getDisplayMedia({ video: true })
          .then((stream: MediaStream) => {
            context.actions.startStreaming(stream);

            stream.oninactive = () => {
              if (context.state.localPeer.stream != null) {
                context.actions.stopStreaming();
              }
            }
          })
          .catch((error: Error) => {
            console.log('error streaming ', error);
          });

      } else {
        context.actions.stopStreaming();
      }
    }
  }

  /**
   * Render an action
   * @param icon the icon to use for this action
   * @param action the name of the action
   */
  renderAction(context: ApplicationContext, icon: string, action: string) {
    return <li className="action-item" role="presentation">
      <a className={`action-label icon actions ${icon}`}
         role="button"
         onClick={() => this.handleAction(context, action)}/>
    </li>;
  }

  render() {
    return <div className="toolbar">
      <div className="action-bar">
        <ul className="actions-container" role="toolbar">
          <ApplicationContextConsumer>
            {context => (
              <div>
                {this.renderAction(context, 'full-screen', 'full-screen')}
                {this.renderAction(context, 'microphone', 'microphone')}
                {this.renderAction(context, 'share', 'share')}
                {this.renderAction(context, 'leave', 'leave')}
                {this.renderAction(context, 'settings', 'settings')}
              </div>
            )}
          </ApplicationContextConsumer>
        </ul>
      </div>
    </div>
  }

}

