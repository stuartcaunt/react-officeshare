import React, {Component} from 'react';
import {Participant} from "./Participant";
import {Peer} from '../models';

export class Participants extends Component<{ participants: Array<Peer> }, {}> {

  constructor(props: { participants: Array<Peer> }) {
    super(props);

  }

  /**
   * Render a list of participants currently in the room
   */
  private renderParticipants() {
    return this.props.participants.map((participant, index) => (
      <Participant key={index} peer={participant}/>
    ));
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