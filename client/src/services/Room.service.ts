import {Room} from '../models';
import * as socketIoClient from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

export class RoomService {

  private _room$: BehaviorSubject<{room: Room, error: string}> = new BehaviorSubject<{room: Room, error: string}>(null);

  public get room$(): BehaviorSubject<{room: Room, error: string}> {
    return this._room$;
  }

  public connect(roomName: string, roomId: string, userName: string) {

    // Connect to server
    const socket = socketIoClient.connect(`https://${window.location.hostname}:8443`, {
      // reconnection: false
    });

    socket.on('connect', () => {
      console.log('Connected with id ' + socket.id + ' to room ' + roomId);

      if (roomId == null) {
        // Create room
        socket.emit('create', {roomName: roomName, userName: userName}, (data: any) => {
          roomId = data.roomId;
          this.joinRoom(roomId, userName, socket)
        });

      } else {
        // Join room
        this.joinRoom(roomId, userName, socket)
      }
    });
  }

  public joinRoom(roomId: string, userName: string, socket: SocketIOClient.Socket) {
    // Join room
    socket.emit('join', {roomId: roomId, userName: userName}, (data: any) => {
      const error = data.error;
      const otherClients = data.clients;
      const presenterPeerId = data.presenter;
      const roomName = data.roomName;

      if (error != null) {
        this._room$.next({room: null, error: error});

      } else {
        const room = new Room(socket, otherClients, presenterPeerId, roomId, roomName, userName);
        this._room$.next({room: room, error: null});
      }
    });
  }
}