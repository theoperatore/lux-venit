'use strict';

require('localenv');

import test from 'tape';
import OSC from 'node-osc';
import io from 'socket.io-client';

const osc = new OSC.Client(process.env.OSC_SERVER_IP_ADDRESS, process.env.OSC_PORT);

function sendColor(colorArr) {
  return new Promise((resolve, reject) => {
    osc.send('/color', colorArr, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    })
  })
}

test('IT: server listens for websocket connections', t => {
  t.plan(1);

  let socket = io.connect(`http://localhost:${process.env.WSS_PORT}`, { reconnection: false });

  socket.on('connect', () => {
    t.pass('client connected');
    socket.close();
  });

  socket.on('connect_error', err => {
    t.fail(err);
    t.end();
    socket.close();
  })
})

test('IT: server emits color updates to connected clients', t => {
  t.plan(3);

  let socket = io.connect(`http://localhost:${process.env.WSS_PORT}`, { reconnection: false });

  sendColor(['255', '255', '255', '500']).catch(err => {
    t.fail(err);
    t.end();
    socket.close();
  });

  socket.on('message', data => {
    t.equals(data.type, 'COLOR_CHANGE', 'got expected message type');
    t.deepEquals(data.color.rgba, ['255', '255', '255'], 'got expected color values');
    t.equals(data.color.fadeTime, 500, 'got expected fade time');

    socket.close();
  });

  socket.on('connect_error', err => {
    t.fail(err);
    t.end();
    socket.close();
  });
});

test('IT: server interprets a 3 argument message as having 0 fadeTime', t => {
  t.plan(2);

  let socket = io.connect(`http://localhost:${process.env.WSS_PORT}`, { reconnection: false });

  sendColor(['123', '123', '123']).catch(err => {
    t.fail(err);
    t.end();
    socket.close();
  });

  socket.on('message', data => {
    t.deepEquals(data.color.rgba, ['123', '123', '123'], 'got expected color values');
    t.equals(data.color.fadeTime, 0, 'got expected fade time');

    socket.close();
  });

  socket.on('connect_error', err => {
    t.fail(err);
    t.end();
    socket.close();
  });
})

test.onFinish(() => {
  osc.kill();
})