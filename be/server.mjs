
import express from 'express';
import http from 'http';
import playRouter from './controllers/play.mjs';
import WebSocketHandler from './WebSocketHandler.mjs';

const app = express();
const server = http.createServer(app);

// WebSocket
WebSocketHandler(server);

// middleware
app.use(express.json());

// controllers
app.use('/api/play', playRouter);

export default server;