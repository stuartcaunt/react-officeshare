export class ChatMessage {
  private _id: string;
  private _username: string;
  private _message: string;
  private _createdAt: string;

  constructor(username: string, message: string, createdAt: string) {
    this.username = username;
    this.message = message;
    this.createdAt = createdAt;
  }

  set id(id: string) {
    this._id = id;
  }
  
  get id() {
    return this._id;
  }

  set username(username: string) {
    this._username = username;
  }

  get username() {
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