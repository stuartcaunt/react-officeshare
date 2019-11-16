const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const sockets = require('./sockets');
const logger = require('./logger');
const RoomService = require("./room.service");

const useHTTPS = true;

const PORT = parseInt(process.env.PORT) || 8000;

logger.info(`Running ${useHTTPS ? 'HTTPS' : 'HTTP'} server on port ${PORT}`);
const serverConfig = useHTTPS ? {
    key: fs.readFileSync(path.resolve(__dirname, '../certs','key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs','cert.pem')),
} : {
};

const app = express();

const webServerProvider = useHTTPS ? https : http;

const server = webServerProvider.createServer(serverConfig, app);
const roomServive = new RoomService(path.resolve(__dirname, '../db.json'));

server.listen(PORT);
sockets(server, roomServive);

