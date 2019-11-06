import React, {Component} from 'react';
import { ToolbarAction } from '../models';

export class Toolbar extends Component<{ actions: ToolbarAction[] }, {}> {

  constructor(props: { actions: ToolbarAction[] }) {
    super(props);
  }

  renderActions() {
    return this.props.actions
      .filter(action => action.visible)
      .map(action => this.renderAction(action));
  }

  /**
   * Render an action
   * @param action the action to render
   */
  renderAction(action: ToolbarAction) {
    return <li className={`action-item  ${action.enabled ? '' : 'action-disabled'}`} role="presentation" key={action.id} onClick={() => action.handler()}>
      <a className={`action-label icon actions ${action.icon} `} role="button"/>
      <span className="action-description">{action.label}</span>
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

