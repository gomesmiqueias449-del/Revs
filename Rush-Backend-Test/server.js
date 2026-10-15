'use strict';

const http = require('node:http');
const { createHash } = require('node:crypto');

const DEFAULT_PHOTON_APP_ID = '73ce7592-a817-42ff-8e4a-660418a96536';
const MAX_BODY_BYTES = 64 * 1024;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });

    req.on('end', () => {
      if (tooLarge) {
        const error = new Error('Request body too large');
        error.statusCode = 413;
        reject(error);
        return;
      }
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        const value = JSON.parse(text || '{}');
        if (!value || Array.isArray(value) || typeof value !== 'object') {
          const error = new Error('JSON body must be an object');
          error.statusCode = 400;
          reject(error);
          return;
        }
        resolve(value);
      } catch {
        const error = new Error('Invalid JSON body');
        error.statusCode = 400;
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function stableTestUserId(deviceId) {
  const digest = createHash('sha256').update(deviceId, 'utf8').digest();
  const id = digest.readUInt32BE(0) & 0x7fffffff;
  return id || 1;
}

function createServer(options = {}) {
  const photonAppId = options.photonAppId ?? process.env.PHOTON_APP_ID ?? DEFAULT_PHOTON_APP_ID;
  const testUsername = options.testUsername ?? process.env.TEST_USERNAME ?? 'TestPlayer';

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    let pathname;
    try {
      pathname = new URL(req.url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
    } catch {
      sendJson(res, 400, { error: 'Invalid request URL' });
      return;
    }

    if (req.method === 'GET' && pathname === '/') {
      sendJson(res, 200, {
        service: 'Rush Photon Test Backend',
        mode: 'test-only',
        endpoints: ['/health', '/config', 'POST /user/login/'],
      });
      return;
    }

    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, { ok: true, service: 'rush-photon-test-backend' });
      return;
    }

    if (req.method === 'GET' && pathname === '/config') {
      sendJson(res, 200, {
        photonAppId,
        note: 'This only publishes the Photon App ID; it does not host Photon Cloud.'
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/user/login') {
      try {
        const body = await readJson(req);
        const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : '';
        const country = typeof body.country === 'string' ? body.country.trim().toUpperCase() : '';
        const hash = typeof body.hash === 'string' ? body.hash.trim() : '';

        if (!deviceId || !country || !hash) {
          sendJson(res, 400, { error: 'deviceId, country, and hash are required' });
          return;
        }

        // Test stub only: accepts any non-empty hash and does not persist accounts.
        // Do not use this endpoint for a production game or real player data.
        sendJson(res, 200, {
          banned: false,
          username: testUsername,
          country: country.slice(0, 2),
          trophys: 0,
          crowns: 0,
          id: stableTestUserId(deviceId),
          experience: 0,
          gems: 0,
          coins: 0,
        });
      } catch (error) {
        sendJson(res, error.statusCode || 400, { error: error.message || 'Invalid request' });
      }
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  });

  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 10_000);
  const server = createServer();
  server.listen(port, '0.0.0.0', () => {
    console.log(`Rush test backend listening on 0.0.0.0:${port}`);
  });
}

module.exports = { createServer };
