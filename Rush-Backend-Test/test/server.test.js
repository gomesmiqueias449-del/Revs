'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

const photonAppId = '38243ef8-cd92-46b6-b3d1-e27a6a34959b';
let server;
let baseUrl;

test.before(async () => {
  server = createServer({ photonAppId, testUsername: 'TestPlayer' });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
});

test('GET /health returns an OK status', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: 'rush-photon-test-backend' });
});

test('GET /config publishes the confirmed Photon App ID', async () => {
  const response = await fetch(`${baseUrl}/config`);
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.photonAppId, photonAppId);
});

test('POST /user/login returns the fields expected by the mod', async () => {
  const response = await fetch(`${baseUrl}/user/login/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ deviceId: 'device-test-1', country: 'br', hash: 'test-only' }),
  });
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(data).sort(), [
    'banned', 'coins', 'country', 'crowns', 'experience', 'gems', 'id', 'trophys', 'username',
  ].sort());
  assert.equal(data.banned, false);
  assert.equal(data.country, 'BR');
  assert.equal(data.username, 'TestPlayer');
  assert.equal(Number.isInteger(data.id), true);
  assert.equal(data.id > 0, true);
  assert.equal('hash' in data, false);
});

test('POST /user/login rejects missing fields', async () => {
  const response = await fetch(`${baseUrl}/user/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ deviceId: 'device-test-1' }),
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /required/);
});
