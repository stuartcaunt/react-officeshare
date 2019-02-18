import {Peer, Room} from '../models';

export class ApplicationActions {

  private _room: Room;

  get room(): Room {
    return this._room;
  }

  set room(value: Room) {
    this._room = value;
  }

  constructor() {
  }

  startStreaming(stream: MediaStream) {
    this._room.startStreaming(stream);
  }

  stopStreaming() {
    this._room.stopStreaming();
  }

}
