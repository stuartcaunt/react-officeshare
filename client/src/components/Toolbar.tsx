import React, {Component} from 'react';

export class Toolbar extends Component<{}, {}> {

    private handleAction(action: string) {
        console.log('Clicked action', action)
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

