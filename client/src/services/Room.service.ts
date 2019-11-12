import {Room, RoomPass} from '../models';
import * as socketIoClient from 'socket.io-client';

export class RoomService {

  public create(roomName: string, userName: string): Promise<RoomPass> {
    const promise = new Promise<RoomPass>(function (resolve, reject) {

      // Connect to server
      const socket = socketIoClient.connect(`http://${window.location.hostname}:8000`, {
        // reconnection: false
      });

      socket.on('connect', () => {
        console.log('Connected with id ' + socket.id);

        // Join room
        socket.emit('create', {roomName: roomName, userName: userName}, (data: any) => {
          const roomId = data.roomId;

          const roomPass = new RoomPass(socket, roomId, userName);
          resolve(roomPass);

          // TODO handle errors (modify return data)
        });

      });

    });

    return promise;
  }

  public connect(roomId: string, userName: string): Promise<Room> {
    const self = this;
    const promise = new Promise<Room>(function (resolve, reject) {

      // Connect to server
      const socket = socketIoClient.connect(`http://${window.location.hostname}:8000`, {
        // reconnection: false
      });

      socket.on('connect', () => {
        console.log('Connected with id ' + socket.id);

        self.joinRoom(roomId, userName, socket)
          .then(room => {
            resolve(room);
          })
          .catch(error => {
            reject(error);
          });

      });

    });

    return promise;
  }

  public joinRoom(roomId: string, userName: string, socket: SocketIOClient.Socket): Promise<Room> {
    const promise = new Promise<Room>(function (resolve, reject) {
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
          const room = new Room(socket, otherClients, presenterPeerId, roomName, userName);
          resolve(room);
        }
      });
    
    });

    return promise;
  }
}