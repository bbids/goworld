import { response } from "express";
import { describe, it, expect, assert } from "vitest";

const app = require('../server');
const request = require('supertest')

const _ = require('lodash');

const sampleGameObject = {
  gameId: '22142124',
  status: 'GAME_START',
  count: 2
};

describe.concurrent("api/play integration", async () => {
  describe('GET / ', async () => {
    it("response body is json GET /", async () => {
      const response = await request(app).get('/api/play');
      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toMatch(/json/);
    });

    it("can get at least one correct game", async () => {
      await request(app).get('/api/play/create_game');
      await request(app).get('/api/play/create_game');
      await request(app).get('/api/play/create_game');
      const response = await request(app).get('/api/play');
      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toMatch(/json/);
      
      // get a game and compare the properties with sameGameObject
      const game = Object.values(response.body)[0];
      Object.keys(sampleGameObject).forEach(key => {
        expect(game).toHaveProperty(key);
      });
    });
  });

  describe('GET /create_game', async () => {
    it("can create a valid game", async () => {
      const response = await request(app).get('/api/play/create_game')
      expect(response.status).toBe(201);
      expect(response.header["content-type"]).toMatch(/json/);
      expect(response.body).toHaveProperty('gameId');
      expect(response.body).toHaveProperty('status', 'WAITING');
      expect(response.body).toHaveProperty('count', 0);
    });
  })

  describe('GET /game/:gameId', async () => {
    it("gives correct game through GET /game/:gameId", async () => {
      const correctGame = (await request(app)
        .get('/api/play/create_game')).body;
  
      const game = (await request(app)
        .get(`/api/play/game/${correctGame.gameId}`)).body;

      expect(_.isEqual(game, correctGame)).toBeTruthy();
    });

    it('gives status 404 when gameId is wrong', async () => {
      const wrongId = -1;
      const response = await request(app)
        .get(`/api/play/game/${wrongId}`);

      expect(response.status).toBe(404);
    })
  });

  describe('wrong route', async () => {
    it('returns 404', async () => {
      const response = await request(app).get('/api/play/maniac');

      expect(response.status).toBe(404);
    })
  })
});


// const { test, describe } = require('node:test');
// const assert = require('node:assert');
// 
// const server = require('../server');
// const supertest = require('supertest');
// const api = supertest(server);
// 
// test("something", () => {
//   assert.strictEqual(1, 1);
// });


//test('creating a new game is possible', async () => {
//  const response = api
//    .get('/api/play')
//    .expect(201)
//    .expect('Content-Type', /application\/json/);
//});