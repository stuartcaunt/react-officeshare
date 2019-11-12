import React, {Component, Fragment} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {toast} from "react-toastify";

export class Header extends Component<{ title: string, link: string, toggleChat: () => void, unreadChatMessages: number}, {}> {

  renderLink() {
    const {link} = this.props;
    return (<Fragment>
      <span>{link}</span>
      <CopyToClipboard text={link} onCopy={() => toast.success('Copied to clipboard')}>
        <button className="copy-link">Copy link</button>
      </CopyToClipboard>
    </Fragment>);
  }

  render() {
    const {title, unreadChatMessages} = this.props;
    return <div className="header">
      <div className="left">
        {this.renderLink()}
      </div>
      <div className="center">{title}</div>
      <div className="right">
        {/*<span>Host mode</span>*/}
        {/*<Toggle*/}
        {/*title={"Host mode"}*/}
        {/*defaultChecked={true}*/}
        {/*/>*/}
        <button className="right__button" onClick={this.props.toggleChat}>
          <i className="far fa-comments"/>
          { unreadChatMessages > 0 &&
            <span className="badge">{unreadChatMessages}</span>
          }
        </button>
      </div>
    </div>
  }


}