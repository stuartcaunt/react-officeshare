import React, {Component} from 'react';
import {Peer} from '../models';

export class Participant extends Component<{ peer: Peer }> {

    constructor(props: any) {
        super(props);

        props.peer.stream$.subscribe((stream: MediaStream) => {
          if (stream == null) {

          } else {

          }
        })
    }

    render() {
        const {peer} = this.props;
        return <div className="participant">
            <img src="/images/thumbnails/screen_ubuntu.png"/>
            <div className="participant__user">
                <span className="participant__user__content">
                    <span className="participant__user__username">{peer.userName}</span>
                    <span
                        className="participant__user__status participant__user__status--online">
                        <i className="fa fa-circle"/>
                    </span>
                </span>
            </div>
        </div>
    }

}