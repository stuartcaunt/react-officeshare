export class RoomPass {

  public get socket(): SocketIOClient.Socket {
    return this._socket;
  }

  public get roomId(): string {
    return this._roomId;
  }

  public get userName(): string {
    return this._userName;
  }

  constructor(private _socket: SocketIOClient.Socket, private _roomId: string, private _userName: string) {
  }
}
