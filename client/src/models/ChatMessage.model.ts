export class ChatMessage {
  private _id: string;
  private _username: string;
  private _message: string;
  private _createdAt: string;

  constructor(userName: string, message: string, createdAt: string) {
    this.userName = userName;
    this.message = message;
    this.createdAt = createdAt;
  }

  set id(id: string) {
    this._id = id;
  }
  
  get id() {
    return this._id;
  }

  set userName(userName: string) {
    this._username = userName;
  }

  get userName() {
    return this._username;
  }

  set message(message: string) {
    this._message = message;
  }

  get message() {
    return this._message;
  }

  set createdAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  get createdAt() {
    return this._createdAt;
  }

}