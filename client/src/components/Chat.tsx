import React, { Component } from 'react';
import Linkify from 'react-linkify';
import Moment from 'react-moment';
import { ChatMessage } from '../models';

export class Chat extends Component<{ messages: ChatMessage[], userName: string, onSendMessage: (message: string) => void }> {

  handleSend(event: any) {
    if (event.key === 'Enter') {
      const inputValue = event.target.value;
      if (inputValue.length > 0) {
        this.props.onSendMessage(inputValue);
        event.target.value = "";
      }
    }
  }

  getClass(message: ChatMessage) {
    const baseClass = 'message';
    if (message.userName === this.props.userName) {
      return baseClass;
    }
    return `${baseClass} ${baseClass}--right`;
  }

  renderMessages() {

    const componentDecorator = (href: string, text: string, key: number) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer" >
        {text}
      </a>
    );

    const { messages } = this.props;
    if (messages.length > 0) {
      return (
        <div className="chat__messages">
          {messages.map(message => {
            return (
              <div className={this.getClass(message)} key={message.id}>
                <div className="author">
                  <span className="name">{message.userName}</span>
                  <time className="time" title={message.createdAt}>
                    <Moment fromNow interval={30}>{message.createdAt}</Moment>
                  </time>
                </div>
                <div className="body">
                  <Linkify componentDecorator={componentDecorator}>
                    {message.message}
                  </Linkify>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div className="chat__blankslate">
        <p>No chat messages to display</p>
      </div>
    )
  }

  render() {
    return <div className="chat">
      <div className="chat__header">Chat</div>
      {this.renderMessages()}
      <div className="chat__box">
        <input type="text"
          className="chat__input"
          autoFocus={true}
          onKeyDown={this.handleSend.bind(this)}
          placeholder="Send message..." />
      </div>
    </div>
  }

}