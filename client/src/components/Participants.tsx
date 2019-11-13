import React, {Component} from 'react';
import {Participant} from "./Participant";
import {Peer} from '../models';

export class Participants extends Component<{ participants: Array<Peer>, localPeer: Peer, onParticipantClick: (peer: Peer) => void }, {}> {

  /**
   * Render local peer
   */
  private renderLocalPeer() {
    return <Participant peer={this.props.localPeer} onParticipantClick={this.props.onParticipantClick}/>;
  }

  /**
   * Render a list of participants currently in the room
   */
  private renderParticipants() {
    const otherPeers = this.props.participants.filter(participant => participant !== this.props.localPeer);

    if (otherPeers.length > 0) {
      return otherPeers.map((participant, index) => (
        <Participant key={index} peer={participant} onParticipantClick={this.props.onParticipantClick}/>
      ));
    } else {
      return <div>Waiting for other people to join...</div>
    }
  }

  render() {
    return <div className="participants">
      <div className="participants__header">You</div>
      <div className="participants__list">
        <div className="participants">
          {this.renderLocalPeer()}
        </div>
      </div>

      <div className="participants__header">Participants</div>
      <div className="participants__list">
        <div className="participants">
          {this.renderParticipants()}
        </div>
      </div>
    </div>
  }

}