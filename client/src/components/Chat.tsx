import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class Chat extends Component<{}, { title: string }> {
    render() {
        return <div className="chat">
            <div className="chat__header">Chat</div>
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
    }

}