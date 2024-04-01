/**
 * Stores WebSocketServer with gameId keys
 */
const WSS = new Map();

/**
 * Stores game jsons containing game properties
 */
const gameData = new Map();

module.exports = {
  WSS, gameData
};