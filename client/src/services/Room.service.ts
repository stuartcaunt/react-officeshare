import {Room} from '../models';
import * as socketIoClient from 'socket.io-client';

export class RoomService {

  public connect(roomName: string, userName: string): Promise<Room> {
    const promise = new Promise<Room>(function (resolve, reject) {

      // Connect to server
      const socket = socketIoClient.connect(`http://${window.location.hostname}:8000`, {
        // reconnection: false
      });

      socket.on('connect', () => {
        console.log('Connected with id ' + socket.id);

        // Join room
        socket.emit('join', {roomName: roomName, userName: userName}, (data: any) => {
          const otherClients = data.clients;

          const room = new Room(socket, otherClients, roomName, userName);
          resolve(room);

          // TODO handle errors (modify return data)
        });

      });

    });

    return promise;
  }
}