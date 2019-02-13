const socketIO = require('socket.io');
const uuid = require('node-uuid');

module.exports = function (server) {
  const io = socketIO.listen(server);

  io.sockets.on('connection', function (socket) {

    socket.on('join', join);
    socket.on('leave', leave);
    socket.on('disconnect', leave);
    socket.on('offer', offer);
    socket.on('answer', answer);
    socket.on('candidate', candidate);
    socket.on('stream_started', streamStarted);
    socket.on('stream_stopped', streamStopped);

    function join(data, cb) {
      const room = data.room || 'room-' + uuid();
      const username = data.username;

      console.log(username + ' (' + socket.id + ') is joining room ' + room);

      // leave any existing rooms
      leave();

      const roomData = {
        clients: getClientsInRoom(room)
      };

      if (cb) {
        cb(roomData);
      }

      // Emit message to other room members to say we have entered the room
      socket.to(room).emit('join', {
        clientId: socket.id,
        name: username
      });

      socket.join(room);
      socket.userdata = {
        room: room,
        username: username,
        streaming: false
      };
    }

    function leave() {
      if (socket.userdata && socket.userdata.room) {
        console.log(socket.userdata.username + ' (' + socket.id + ') is leaving room ' + socket.userdata.room);

        socket.to(socket.userdata.room).emit('leave', {
          clientId: socket.id,
          name: socket.userdata.username
        });

        socket.leave(socket.userdata.room);
        socket.userdata = undefined;
      }
    }

    function offer(message) {
      const {clientId, data} = message;
      console.log(socket.userdata.username + ' (' + socket.id + ') sending offer to ' + clientId);

      io.to(clientId).emit('offer', {
        clientId: socket.id,
        data: data
      });
    }

    function answer(message) {
      const {clientId, data} = message;
      console.log(socket.userdata.username + ' (' + socket.id + ') sending answer to ' + clientId);

      io.to(clientId).emit('answer', {
        clientId: socket.id,
        data: data
      });
    }

    function candidate(message) {
      const {clientId, data} = message;
      console.log(socket.userdata.username + ' (' + socket.id + ') sending candidate to ' + clientId);

      io.to(clientId).emit('candidate', {
        clientId: socket.id,
        data: data
      });
    }

    function streamStarted() {
      if (socket.userdata && socket.userdata.room) {
        console.log(socket.userdata.username + ' (' + socket.id + ') started streaming to room ' + socket.userdata.room);

        socket.userdata.streaming = true;

        socket.to(socket.userdata.room).emit('stream_started', {
          clientId: socket.id,
        });
      }
    }

    function streamStopped() {
      if (socket.userdata && socket.userdata.room) {
        console.log(socket.userdata.username + ' (' + socket.id + ') stopped streaming to room ' + socket.userdata.room);

        socket.userdata.streaming = false;

        socket.to(socket.userdata.room).emit('stream_stopped', {
          clientId: socket.id,
        });
      }
    }

  });

  function getClientsInRoom(name) {
    const adapter = io.nsps['/'].adapter;
    if (adapter.rooms[name] != null) {
      const socketIds = Object.keys(adapter.rooms[name].sockets);

      return socketIds.map(socketId => {
        return {
          id: socketId,
          userdata: adapter.nsp.connected[socketId].userdata
        }
      });

    } else {
      return [];
    }
  }

};
