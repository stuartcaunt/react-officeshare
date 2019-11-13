import React, {Component} from 'react';

export class Video extends Component<{ stream: MediaStream }, {}> {

  private _videoElement: HTMLVideoElement;

  public componentDidMount() {
    this._videoElement.srcObject = this.props.stream;
  }

  public componentDidUpdate(prevProps: Readonly<{ stream: MediaStream }>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.stream !== prevProps.stream) {
      this._videoElement.srcObject = this.props.stream;
    }
  }

  render() {
    return (<video autoPlay ref={(ref) => this._videoElement = ref}/>);
  }

}