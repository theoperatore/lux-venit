'use strict';

require('localenv');

let httplog = require('debug')('lunina:server:http');
let wsslog = require('debug')('lunina:server:wss');
let osclog = require('debug')('lunina:server:osc');

let fs = require('fs')
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

app.listen(process.env.HTTP_PORT, () => {
  httplog(`http up on port ${process.env.HTTP_PORT}`);
});


///////////////////////////////////////////////////////////////////////////////
//
// websocket server
//
///////////////////////////////////////////////////////////////////////////////
let io = IO(process.env.WSS_PORT);
io.on('connection', socket => {
  let color = store.getState().color;
  wsslog(`wss client connected [ ${socket.id} ]`);
  socket.emit('message', { type: 'COLOR_CHANGE', color });

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
  store.dispatch({ type: addr, data: args });
});


///////////////////////////////////////////////////////////////////////////////
//
// client broadcasting
//
///////////////////////////////////////////////////////////////////////////////
store.subscribe(() => {
  let color = store.getState().color;
  io.emit('message', { type: 'COLOR_CHANGE', color });
});
