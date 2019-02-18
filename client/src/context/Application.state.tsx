import {Peer, Room} from '../models';

export interface ApplicationState {
  participants: Array<Peer>;
  presenter: Peer;
  followPresenter: boolean;
  localPeer: Peer;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  participants: new Array<Peer>(),
  presenter: null,
  followPresenter: true,
  localPeer: null
};
