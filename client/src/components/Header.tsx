import React, {Component} from 'react';

export class Header extends Component<{ participants: number, title: string, toggleChat: () => void }, {}> {

  render() {
    const {title, participants} = this.props;
    return <div className="header">
      <div className="left">
        <span>https://jamie.me/jfd4lksl</span>
        <button className="copy-link">Copy link</button>
        {/*<i className="fas fa-users"/><span>{participants} participants</span>*/}
      </div>
      <div className="center">{title}</div>
      <div className="right">
        {/*<span>Host mode</span>*/}
        {/*<Toggle*/}
        {/*title={"Host mode"}*/}
        {/*defaultChecked={true}*/}
        {/*/>*/}
        <button onClick={this.props.toggleChat}>
          <i className="far fa-comments"/>
        </button>
      </div>
    </div>
  }


}