import {Room} from '../models';

export interface ApplicationState {
  room: Room;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  room: null,
};