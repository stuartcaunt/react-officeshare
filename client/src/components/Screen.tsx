import React, {Component} from 'react';

export class Screen extends Component<{}, {}> {
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
            <img
                src="https://www.ghacks.net/wp-content/uploads/2018/03/Elementary-Applications-Menu.jpeg"/>
        </div>
    }

}

