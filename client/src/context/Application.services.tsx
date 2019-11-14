import { RoomService } from '../services';

export interface ApplicationServices {
  roomService: RoomService;
}

export const INITIAL_APPLICATION_SERVICES: ApplicationServices = {
  roomService: new RoomService(),
};