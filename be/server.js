const express = require('express');
const http = require('http');
const playRouter = require('./controllers/play');
const WebSocketHandler = require('./WebSocketHandler');


const app = express();
const server = http.createServer(app);

// WebSocket
WebSocketHandler(server);

// middleware
app.use(express.json());

// controllers
app.use('/api/play', playRouter);

module.exports = server;