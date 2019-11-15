const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(process.env.SERVE_DIRECTORY || 'build'));

const PORT = parseInt(process.env.PORT) || 8443;
console.log(`Running HTTPS server on port ${PORT}`);
const serverConfig = {
    key: fs.readFileSync(path.resolve(__dirname, './certs','key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, './certs','cert.pem')),
};

const server = https.createServer(serverConfig, app);

server.listen(PORT);