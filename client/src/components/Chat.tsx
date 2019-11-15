import React, { Component } from 'react';
import Linkify from 'react-linkify';
import Moment from 'react-moment';
import { ChatMessage } from '../models';

export class Chat extends Component<{ messages: ChatMessage[], onSendMessage: (message: string) => void }> {

  handleSend(event: any) {
    if (event.key === 'Enter') {
      const inputValue = event.target.value;
      if (inputValue.length > 0) {
        this.props.onSendMessage(inputValue);
        event.target.value = "";
      }
    }
  }

  renderMessages() {

    const componentDecorator = (href: string, text: string, key: number) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer" >
        {text}
      </a>
    );

    const { messages } = this.props;
    return messages.map(message => {
      return (
        <div className="message" key={message.id}>
          <div className="author">
            <span className="name">{message.username}</span>
            <time className="time" title={message.createdAt}>
              <Moment fromNow interval={30}>{message.createdAt}</Moment>
            </time>
          </div>
          <div className="content">
            <Linkify componentDecorator={componentDecorator}>
              <p>{message.message}</p>
            </Linkify>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div className="chat">
      <div className="chat__header">Chat</div>
      <div className="chat__messages">
        {this.renderMessages()}
      </div>
      <div className="chat__box">
        <input type="text" className="chat__input" autoFocus={true} onKeyDown={this.handleSend.bind(this)} placeholder="Send message..." />
      </div>
    </div>
  }

}