const socketIO = require('socket.io');
const shortid = require('shortid');
const logger = require('./logger');
const path = require('path');

module.exports = function (server, roomService) {

  const io = socketIO.listen(server);
  const roomDataMap = new Map(); // id: {roomName, activePresenter, owner}
  
  // populate room data map from the database
  roomService.getAll().forEach(room => {
    roomDataMap.set(room.id, {
      roomName: room.name, 
      activePresenter: null
    });
  });

  io.sockets.on('connection', function (socket) {

    // Set up listeners
    socket.on('create', create);
    socket.on('join', join);
    socket.on('leave', leave);
    socket.on('disconnect', leave);
    socket.on('offer', offer);
    socket.on('answer', answer);
    socket.on('candidate', candidate);
    socket.on('stream_started', streamStarted);
    socket.on('stream_stopped', streamStopped);
    socket.on('presenter_started', presenterStarted);
    socket.on('presenter_stopped', presenterStopped);
    socket.on('chat:message', chatMessage);

    function create(data, cb) {
      const userName = data.userName;
      const room = roomService.create(data.roomName);
      const roomName = room.name;
      const roomId = room.id;
      logger.info(`${userName} (${socket.id}) is creating room ${roomName} (${roomId})`);

      // leave any existing rooms
      leave();

      roomDataMap.set(roomId, {
        roomName: roomName, 
        activePresenter: null
      });

      // Send back the generated roomId
      if (cb) {
        cb({
          roomId: roomId
        });
      }
    }

    function join(data, cb) {
      const roomId = data.roomId;
      const userName = data.userName;
      const roomData = roomDataMap.get(roomId);

      logger.info(userName + ' (' + socket.id + ') is joining room ' + roomId);

      // leave any existing rooms
      leave();

      if (roomData != null) {
        const roomInfo = {
          clients: getClientsInRoom(roomId),
          presenter: roomData.activePresenter,
          roomName: roomData.roomName
        };
  
        if (cb) {
          cb(roomInfo);
        }
  
        // Emit message to other room members to say we have entered the room
        socket.to(roomId).emit('join', {
          peerId: socket.id,
          userName: userName
        });
  
        socket.join(roomId);
        socket.userData = {
          roomId: roomId,
          userName: userName,
          streaming: false
        };
  
      } else {
        if (cb) {
          logger.error(`Room with id '${roomId}' does not exist`);
          cb({
            error: `Room with id '${roomId}' does not exist`
          })
        }
      }
    }

    function leave() {
      if (socket.userData && socket.userData.roomId) {
        logger.info(socket.userData.userName + ' (' + socket.id + ') is leaving room ' + socket.userData.roomId);

        socket.to(socket.userData.roomId).emit('leave', {
          peerId: socket.id,
          userName: socket.userData.userName
        });

        socket.leave(socket.userData.roomId);
        socket.userData = undefined;
      }
    }

    function offer(message) {
      const {peerId, data} = message;
      logger.info(socket.userData.userName + ' (' + socket.id + ') sending offer to ' + peerId);

      io.to(peerId).emit('offer', {
        peerId: socket.id,
        data: data
      });
    }

    function answer(message) {
      const {peerId, data} = message;
      logger.info(socket.userData.userName + ' (' + socket.id + ') sending answer to ' + peerId);

      io.to(peerId).emit('answer', {
        peerId: socket.id,
        data: data
      });
    }

    function candidate(message) {
      const {peerId, data} = message;
      logger.info(socket.userData.userName + ' (' + socket.id + ') sending candidate to ' + peerId);

      io.to(peerId).emit('candidate', {
        peerId: socket.id,
        data: data
      });
    }

    function streamStarted() {
      if (socket.userData && socket.userData.roomId) {
        logger.info(socket.userData.userName + ' (' + socket.id + ') started streaming to room ' + socket.userData.roomId);

        socket.userData.streaming = true;

        socket.to(socket.userData.roomId).emit('stream_started', {
          peerId: socket.id,
        });
      }
    }

    function streamStopped() {
      const roomId = socket.userData.roomId;
      if (socket.userData && roomId) {
        logger.info(socket.userData.userName + ' (' + socket.id + ') stopped streaming to room ' + roomId);

        socket.userData.streaming = false;

        socket.to(socket.userData.roomId).emit('stream_stopped', {
          peerId: socket.id,
        });

        // Check for active presenter
        let roomData = roomDataMap.get(roomId); 
        if (roomData.activePresenter === socket.id) {
          removeActivePresenter(roomId, socket.userData.userName, socket.id);
        }
      }
    }

    function presenterStarted() {
      const roomId = socket.userData.roomId;
      if (socket.userData && roomId) {
        if (socket.userData.streaming) {
          logger.info(socket.userData.userName + ' (' + socket.id + ') started presenting to room ' + roomId);
  
          // Update active presenter
          let roomData = roomDataMap.get(roomId); 
          roomData.activePresenter = socket.id;
          roomDataMap.set(roomId, roomData); 
  
          io.in(roomId).emit('presenter_started', {
            peerId: socket.id
          });
  
        } else {
          logger.info(socket.userData.userName + ' (' + socket.id + ') wanted to present to room '  + roomId  + ' but cannot because they are not streaming');
        }
      }
    }
  
    function presenterStopped() {
      if (socket.userData && socket.userData.roomId) {
        removeActivePresenter(socket.userData.roomId, socket.userData.userName, socket.id);
      }
    }

    function chatMessage(data) {
      if (socket.userData && socket.userData.roomId) {
        const {userName, roomId} = socket.userData;
        logger.info(socket.userData.userName + ' sent a new chat message to room ' + socket.userData.roomId);
        const {message} = data;
        io.in(roomId).emit('chat:message', {
          id:  shortid.generate(),
          userName: userName,
          message: message,
          createdAt: new Date()
        });
      }
    }
  });


  function removeActivePresenter(roomId, userName, peerId) {
    let roomData = roomDataMap.get(roomId); 
    if (roomData != null && roomData.activePresenter === peerId) {
      logger.info(userName + ' (' + peerId + ') stopped presenting to room ' + roomId);

      // Update active presenter
      roomData.activePresenter = null;
      roomDataMap.set(roomId, roomData); 

      io.in(roomId).emit('presenter_stopped');
    }
  }

  function getClientsInRoom(roomId) {
    const adapter = io.nsps['/'].adapter;
    if (adapter.rooms[roomId] != null) {
      const socketIds = Object.keys(adapter.rooms[roomId].sockets);
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
