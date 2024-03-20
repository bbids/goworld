console.log("Hello, World!");

const express = require("express");
// const cors = require('cors');
const app = express();

const game_instances = new Set();

// app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
});

app.get("/create_game", (request, response) => {
  const game_id = "awdwjid14ui";

  game_instances.add(game_id);

  console.log(`Created game ${game_id}`)

  response.status(201).json({ game_id });
})

app.get("/join_game/:id", (request, response) => {
  const game_id = request.params.id;

  if (!game_instances.has(game_id))
    response.status(404).json({ "error": "Game instance not found"}).end();
  
  response.status(200).json({ "success": true });
})

app.post("/delete_game/:id", (request, response) => {
  const game_id = request.params.id;

  const success = game_instances.delete(game_id);

  if (success)
    response.status(204);
  else
    response.status(404);
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})