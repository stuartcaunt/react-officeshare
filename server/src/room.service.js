const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

class RoomService {

  constructor(path) {
    const adapter = new FileSync(path);
    const db = low(adapter);
    this.db = db;
    this.db.defaults({ rooms: [] })
      .write();
  }
  
  create(name) {
    const id = this.generateId();
    const data = { id, name: name || 'room-' + id };
    this.db.get('rooms')
      .push(data)
      .write();
    return data;
  }

  generateId() {
    const id = shortid.generate();
    if (this.db.get('rooms')
      .find({ id })
      .value()) {
      this.generateId();
    }
    return id;
  }

  getAll() {
    return this.db.get('rooms').value() || [];
  }

  getById(id) {
    return this.db.get('rooms')
      .find({ id })
      .value();
  }

}

module.exports = RoomService;