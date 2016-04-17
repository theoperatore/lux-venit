'use strict';

require('localenv');

let httplog = require('debug')('lux:server:http');
let wsslog = require('debug')('lux:server:wss');
let osclog = require('debug')('lux:server:osc');

let express = require('express');
let compression = require('compression');
let OSC = require('node-osc');
let IO = require('socket.io');
let store = require('./server-state');


///////////////////////////////////////////////////////////////////////////////
//
// http server
//
///////////////////////////////////////////////////////////////////////////////
let app = express();
app.use('*', (req, res, next) => {
  httplog(`[${req.method}] => ${req.originalUrl}`);
  next();
});
app.use(compression());
app.use(express.static(`${__dirname}/public`));

let server = app.listen(process.env.HTTP_PORT, () => {
  httplog(`http up on port ${process.env.HTTP_PORT}`);
});


///////////////////////////////////////////////////////////////////////////////
//
// websocket server
//
///////////////////////////////////////////////////////////////////////////////
let io = IO(process.env.WSS_PORT);
io.on('connection', socket => {
  wsslog(`wss client connected [ ${socket.id} ]`);

  // send current server state to any newly connected persons
  let color = store.getState().color;
  socket.emit('message', { type: 'COLOR_CHANGE', color });

  // bye bye person :(
  socket.on('disconnect', () => {
    wsslog('disconnected: [ %s ]', socket.id);
  });
});


///////////////////////////////////////////////////////////////////////////////
//
// osc server
//
///////////////////////////////////////////////////////////////////////////////
let osc = new OSC.Server(Number(process.env.OSC_PORT), process.env.OSC_SERVER_IP_ADDRESS);
osc.on('message', (msg, rinfo) => {
  let addr = msg[0];
  let args = msg.slice(1);
  osclog('%s => %o : %o', addr, args, rinfo);

  switch (addr) {
    case process.env.OSC_AUDIENCE_ADDRESS:
      store.dispatch({ type: addr, data: args });
      break;
  }
});


///////////////////////////////////////////////////////////////////////////////
//
// client broadcasting
//
///////////////////////////////////////////////////////////////////////////////
store.subscribe(() => {
  let color = store.getState().color;
  wsslog('sending new state: %o ', color);
  io.emit('message', { type: 'COLOR_CHANGE', color });
});


///////////////////////////////////////////////////////////////////////////////
//
// export stop function used primarily by the unit tests
//
///////////////////////////////////////////////////////////////////////////////
module.export = function stop() {
  io.close();
  osc.kill();
  server.close();
}
