const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const sockets = require('./sockets');

const HTTPS_PORT = parseInt(process.env.PORT) || 8443;
const serverConfig = {
    key: fs.readFileSync(path.resolve(__dirname, '../certs','key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs','cert.pem')),
};

const app = express();
const httpsServer = https.createServer(serverConfig, app);
httpsServer.listen(HTTPS_PORT);

sockets(httpsServer);

