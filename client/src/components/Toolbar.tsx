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
  renderAction(icon: string, action: string, label: string) {
    return <li className="action-item" role="presentation" onClick={() => this.props.actionHandler(action)}>
      <a className={`action-label icon actions ${icon}`}
         role="button"
         />
      <div className="action-description">{label}</div>
    </li>;
  }

  render() {
    return <div className="toolbar">
      <div className="action-bar">
        <ul className="actions-container" role="toolbar">
            {this.renderAction('full-screen', 'full-screen', 'Full screen')}
            {this.renderAction('microphone', 'microphone', 'Turn mic on')}
            {this.renderAction('share', 'share', 'Share my screen')}
            {this.renderAction('leave', 'leave', 'Leave room')}
        </ul>
      </div>
    </div>
  }

}

