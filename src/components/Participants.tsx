import React, {Component} from 'react';
import {Participant} from "./Participant";

export class Participants extends Component<{ participants: string[] }, {}> {

    constructor(props: { participants: string[] }) {
        super(props);
    }


    /**
     * Render a list of participants currently in the room
     */
    private renderParticipants() {
        const {participants} = this.props;
        if (participants.length > 0) {
            return participants.map((participant, index) => (
                <Participant key={index} username={participant}/>
            ));
        }
        return [];
    }

    render() {
        return <div className="participants">
            <div className="participants__header">Participants</div>
            <div className="participants__list">
                <div className="participants">
                    {this.renderParticipants()}
                </div>
            </div>
        </div>
    }

}