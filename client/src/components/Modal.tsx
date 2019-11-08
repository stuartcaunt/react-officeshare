import React, {Component} from 'react';

export class Modal extends Component<{ isVisible: boolean }, {}> {

  constructor(props: { isVisible: boolean}) {
    super(props);
  }

  render() {
    const {isVisible} = this.props;
    return (isVisible &&
      <div className="modal-overlay">
        <div className="modal-body">
          <div className="modal-content">
            <div>{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

