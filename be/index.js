console.log("Hello, World!");

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// const cors = require('cors');

const app = express();
const server = http.createServer(app);

const gameWebSockets = new Map();

// app.use(cors());
app.use(express.json());



const createGameWebSocket = (gameId) => {
  const wss = new WebSocket.WebSocketServer({ noServer: true });
  wss.on('connection', (ws) => {
    console.log(`A new client connected to game ${gameId}`);

    ws.on('message', (message) => {
      // For now send message to everyone except sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      });
    });

    ws.on('close', () => {
      console.log(`Client disconnected from game ${gameId}`);
      // Handle client disconnection
    });
  });

  gameWebSockets[gameId] = {
    wss,
    count: 0
  };
};

server.on("upgrade", (request, socket, head) => {
  const gameId = request.url.substring(1);
  console.log("GAME ID: ", gameId);
  if (gameWebSockets[gameId]) {
    if (gameWebSockets[gameId].count >= 2)
    {
      socket.write('HTTP:/1.1 403 Forbidden\r\n\r\n');
      socket.end('Game is full');
    }
    else 
    {
      gameWebSockets[gameId].wss.handleUpgrade(request, socket, head, (ws) => {
        gameWebSockets[gameId].wss.emit("connection", ws, request);
        ++gameWebSockets[gameId].count;
      });
    }
  }
});


app.get("/play", (request, response) => {
  response.status(200).json({ "success": true });
});

app.get("/play/create_game", async (request, response) => {
  const gameId = "awdwjid14ui";

  await createGameWebSocket(gameId);

  console.log(`Created game ${gameId}`)

  response.status(201).json({ gameId });
});

app.get("/play/end_game/:id", (request, response) => {
  const game_id = request.params.id;

  const success = gameWebSockets.delete(game_id);
  // might be unnecessary to use 404 code
  if (success)
    response.status(204);
  else
    response.status(404);
})

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})