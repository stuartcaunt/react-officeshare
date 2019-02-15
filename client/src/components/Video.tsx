import React, {Component} from 'react';

export class Video extends Component<{ stream: MediaStream }, {}> {

  private _videoElement: HTMLVideoElement;

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this._videoElement.srcObject = this.props.stream;
  }

  render() {
    return <video autoPlay ref={(ref) => this._videoElement = ref}></video>
  }

}