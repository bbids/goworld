
/*
import logger from "../utils/logger";
import heartbeat from "./heartbeat";

export function handlePing() {
  this.instance.send(JSON.stringify({ type: 'PONG' }));
}

export function handleSpectator() {
  heartbeat();
  logger.dev('You are a spectator.');
}

export function handleMessage(wsData) {
  logger.dev(wsData.message);
}

export function handleDefault() {
  logger.dev('Unknown wsData type');
}
*/