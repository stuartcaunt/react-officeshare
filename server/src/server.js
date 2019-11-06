const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const sockets = require('./sockets');

const useHTTPS = false;

const PORT = parseInt(process.env.PORT) || useHTTPS ? 8443 : 8000;
console.log(`Running ${useHTTPS ? 'HTTPS' : 'HTTP'} server on port ${PORT}`);
const serverConfig = useHTTPS ? {
    key: fs.readFileSync(path.resolve(__dirname, '../certs','key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs','cert.pem')),
} : {
};

const app = express();

const webServerProvider = useHTTPS ? https : http;
const server = webServerProvider.createServer(serverConfig, app);

server.listen(PORT);
sockets(server);

