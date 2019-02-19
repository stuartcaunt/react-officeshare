import React, {Component} from 'react';

export class Toolbar extends Component<{actionHandler: (action: string) => void}, {}> {

  constructor(props: {actionHandler: (action: string) => void}) {
    super(props);
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
         onClick={() => this.props.actionHandler(action)}/>
    </li>;
  }

  render() {
    return <div className="toolbar">
      <div className="action-bar">
        <ul className="actions-container" role="toolbar">
          <div>
            {this.renderAction('full-screen', 'full-screen')}
            {this.renderAction('microphone', 'microphone')}
            {this.renderAction('share', 'share')}
            {this.renderAction('leave', 'leave')}
            {this.renderAction('settings', 'settings')}
          </div>
        </ul>
      </div>
    </div>
  }

}

