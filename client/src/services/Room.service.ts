import {Room} from '../models';
import * as socketIoClient from 'socket.io-client';

export class RoomService {


  public connect(roomName: string, roomId: string, userName: string): Promise<Room> {
    const self = this;
    const promise = new Promise<Room>(function (resolve, reject) {

      // Connect to server
      const socket = socketIoClient.connect(`http://${window.location.hostname}:8000`, {
        // reconnection: false
      });

      socket.on('connect', () => {
        console.log('Connected with id ' + socket.id);

        if (roomId == null) {
          // Create room
          socket.emit('create', {roomName: roomName, userName: userName}, (data: any) => {
            roomId = data.roomId;
            self.joinRoom(roomId, userName, socket, resolve, reject)
          });
  
        } else {
          // Join room
          self.joinRoom(roomId, userName, socket, resolve, reject)
        }
      });

    });

    return promise;
  }

  public joinRoom(roomId: string, userName: string, socket: SocketIOClient.Socket, resolve: (room: Room) => void, reject: (error: string) => void) {
    // Join room
    socket.emit('join', {roomId: roomId, userName: userName}, (data: any) => {
      const error = data.error;
      const otherClients = data.clients;
      const presenterPeerId = data.presenter;
      const roomName = data.roomName;

      if (error != null) {
        console.error(error);
        reject(error);

      } else {
        const room = new Room(socket, otherClients, presenterPeerId, roomId, roomName, userName);
        resolve(room);
      }
    });
  }
}