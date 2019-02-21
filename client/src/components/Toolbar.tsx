import React, {Component} from 'react';

export class Toolbar extends Component<{ actionHandler: (action: string) => void }, {}> {

  /**
   * A list of actions for the toolbar
   */
  private _actions = [
    {
      id: 'full-screen',
      icon: 'full-screen',
      label: 'Full screen',
    }, {
      id: 'share',
      icon: 'share',
      label: 'Share my screen'
    },
    {
      id: 'leave',
      icon: 'leave',
      label: 'Leave room'
    }
  ];

  constructor(props: { actionHandler: (action: string) => void }) {
    super(props);
  }

  renderActions() {
    return this._actions.map(action => this.renderAction(action));
  }

  /**
   * Render an action
   * @param action the action to render
   */
  renderAction(action: { id: string, icon: string, label: string }) {
    const {icon, id, label} = action;
    return <li className="action-item" role="presentation" key={id} onClick={() => this.props.actionHandler(id)}>
      <a className={`action-label icon actions ${icon}`} role="button"/>
      <span className="action-description">{label}</span>
    </li>;
  }

  render() {
    return (<div className="toolbar">
      <div className="action-bar">
        <ul className="actions-container" role="toolbar">
          {this.renderActions()};
        </ul>
      </div>
    </div>);
  }

}

