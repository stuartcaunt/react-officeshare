import React, { Component, Fragment } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { store } from 'react-notifications-component';

export class Header extends Component<{ title: string, link: string, toggleChat: () => void, unreadChatMessages: number }, {}> {

  renderLink() {
    const { link } = this.props;
    return (<Fragment>

      <CopyToClipboard text={link} onCopy={this.handleCopy.bind(this)} data-event='click' data-tip='Copied to clipboard'>
        <button className="copy-link"  >
          <img src={"/images/clipboard.png"} className="clipboard-icon" alt="clipboard" /> Copy room link
        </button>
      </CopyToClipboard>
    </Fragment>);
  }

  handleCopy() { 
    store.addNotification({
      message: 'Succesfully copied the link to your clipboard',
      type: 'success',
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: false
      }
    });
  }

  render() {
    const { title, unreadChatMessages } = this.props;
    return <div className="header">
      <div className="left">
        {this.renderLink()}
      </div>
      <div className="center">{title}</div>
      <div className="right">
        <button className="right__button" onClick={this.props.toggleChat}>
          <img src={"/images/chat.png"} className="chat-icon" alt="chat" />
          {unreadChatMessages > 0 &&
            <span className="badge">{unreadChatMessages}</span>
          }
        </button>
      </div>
    </div>
  }


}