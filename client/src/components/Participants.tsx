import React, {Component} from 'react';
import {Participant} from "./Participant";
import {Peer} from '../models';
import {BehaviorSubject} from 'rxjs';

export class Participants extends Component<{ participants: BehaviorSubject<Array<Peer>> }, {}> {

    private _participants: Array<Peer>;

    constructor(props: { participants: BehaviorSubject<Array<Peer>> }) {
        super(props);

        props.participants.subscribe(participants => {
          this._participants = participants;
          this.renderParticipants();
        })
    }


    /**
     * Render a list of participants currently in the room
     */
    private renderParticipants() {
        if (this._participants.length > 0) {
            return this._participants.map((participant, index) => (
                <Participant key={index} peer={participant}/>
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