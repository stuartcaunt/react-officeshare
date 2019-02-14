const socketIO = require('socket.io');
const uuid = require('node-uuid');

module.exports = function (server) {
  const io = socketIO.listen(server);

  io.sockets.on('connection', function (socket) {

    // Set up listeners
    socket.on('join', join);
    socket.on('leave', leave);
    socket.on('disconnect', leave);
    socket.on('offer', offer);
    socket.on('answer', answer);
    socket.on('candidate', candidate);
    socket.on('stream_started', streamStarted);
    socket.on('stream_stopped', streamStopped);

    function join(data, cb) {
      const roomName = data.roomName || 'room-' + uuid();
      const userName = data.userName;

      console.log(userName + ' (' + socket.id + ') is joining room ' + roomName);

      // leave any existing rooms
      leave();

      const roomData = {
        clients: getClientsInRoom(roomName)
      };

      if (cb) {
        cb(roomData);
      }

      // Emit message to other room members to say we have entered the room
      socket.to(roomName).emit('join', {
        peerId: socket.id,
        userName: userName
      });

      socket.join(roomName);
      socket.userData = {
        roomName: roomName,
        userName: userName,
        streaming: false
      };
    }

    function leave() {
      if (socket.userData && socket.userData.roomName) {
        console.log(socket.userData.userName + ' (' + socket.id + ') is leaving room ' + socket.userData.roomName);

        socket.to(socket.userData.roomName).emit('leave', {
          peerId: socket.id,
          userName: socket.userData.userName
        });

        socket.leave(socket.userData.roomName);
        socket.userData = undefined;
      }
    }

    function offer(message) {
      const {peerId, data} = message;
      console.log(socket.userData.userName + ' (' + socket.id + ') sending offer to ' + peerId);

      io.to(peerId).emit('offer', {
        peerId: socket.id,
        data: data
      });
    }

    function answer(message) {
      const {peerId, data} = message;
      console.log(socket.userData.userName + ' (' + socket.id + ') sending answer to ' + peerId);

      io.to(peerId).emit('answer', {
        peerId: socket.id,
        data: data
      });
    }

    function candidate(message) {
      const {peerId, data} = message;
      console.log(socket.userData.userName + ' (' + socket.id + ') sending candidate to ' + peerId);

      io.to(peerId).emit('candidate', {
        peerId: socket.id,
        data: data
      });
    }

    function streamStarted() {
      if (socket.userData && socket.userData.roomName) {
        console.log(socket.userData.userName + ' (' + socket.id + ') started streaming to room ' + socket.userData.roomName);

        socket.userData.streaming = true;

        socket.to(socket.userData.roomName).emit('stream_started', {
          peerId: socket.id,
        });
      }
    }

    function streamStopped() {
      if (socket.userData && socket.userData.roomName) {
        console.log(socket.userData.userName + ' (' + socket.id + ') stopped streaming to room ' + socket.userData.roomName);

        socket.userData.streaming = false;

        socket.to(socket.userData.roomName).emit('stream_stopped', {
          peerId: socket.id,
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
          userData: adapter.nsp.connected[socketId].userData
        }
      });

    } else {
      return [];
    }
  }

};
