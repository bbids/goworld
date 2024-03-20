/**
 * Use a visited flag to prevent React StrictMode and
 * other potential causes to duplicate web sockets.
 */
let visited = false;

const getSocket = (gameId) => {
  if (visited) return null;
  visited = true;

  const socket = new WebSocket(`ws://localhost:3000/${gameId}`);

  socket.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  socket.onmessage = async (event) => {
    // for now a simple message exchanger
    const binaryMsg = event.data;
    const stringMsg = await binaryMsg.text();
    console.log('Received message:', stringMsg);

    /*
    Ideas for later:
      when an opponent arrives, broadcast game object
      whose state is game_ongoing, and from that start
      exchanging "messages" by placing stones on the board
      the game object sends appropriate information, whose
      turn is it etc.
    */

  };

  socket.onclose = () => {
    console.log('Connection closed');
  };

  return socket;
}

export {
  getSocket
};