import React, {Component} from 'react';

export class Participant extends Component<{ username: string }> {

    constructor(props: any) {
        super(props);
    }

    render() {
        const {username} = this.props;
        return <div className="participant">
            <img src="/images/thumbnails/screen_ubuntu.png"/>
            <div className="participant__user">
                <span className="participant__user__content">
                    <span className="participant__user__username">{username}</span>
                    <span
                        className="participant__user__status participant__user__status--online">
                        <i className="fa fa-circle"/>
                    </span>
                </span>
            </div>
        </div>
    }

}