import React, {Component} from 'react';
import './App.scss';

class App extends Component {
    render() {
        return (
            <div className="container">
                <div className="header">

                    <div className="left">
                        <i className="fas fa-users"></i><span>10 participants</span>
                    </div>
                    <div className="center">My room</div>
                    <div className="right">
                        <i className="far fa-comments"></i>
                    </div>
                </div>
                <div className="content">
                    <div className="attendees">

                    </div>
                    <div className="viewer">
                        <div className="screen">

                            <img
                                src="https://www.ghacks.net/wp-content/uploads/2018/03/Elementary-Applications-Menu.jpeg"/>
                        </div>
                        <div className="participants">

                            <div className="toolbar">
                                <div className="action-bar">
                                    <ul className="actions-container" role="toolbar">
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action screenshot" role="button"></a>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action clipboard" role="button"></a>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action settings" role="button"></a>
                                        </li>
                                        <li className="action-item" role="presentation">
                                            <a className="action-label icon debug-action exit-full-screen"
                                               role="button"></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="chat">
                        <div className="chat-messages">
                            <div className="message">
                                <div className="author">
                                    <span className="name">Jamie Hall</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Content goes here. This can include links and other content.</p>
                                </div>
                            </div>
                            <div className="message">
                                <div className="author">
                                    <span className="name">Jamie Hall</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus, tortor
                                        scelerisque aliquam sollicitudin, tellus odio tincidunt mi, in convallis lacus
                                        augue eget nisl. Quisque pretium, tortor eget tempus fringilla.
                                    </p>
                                </div>
                            </div>

                            <div className="message">
                                <div className="author">
                                    <span className="name">Joe Bloggs</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Content goes here. This can include links and other content.</p>
                                </div>
                            </div>

                            <div className="message">
                                <div className="author">
                                    <span className="name">Jane Doe Hall</span>
                                    <span className="time">10:12 AM, Today</span>
                                </div>
                                <div className="content">
                                    <p>Content goes here. This can include links and other content.</p>
                                </div>
                            </div>
                        </div>
                        <div className="send-message">
                            <span>Send message...</span>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default App;
