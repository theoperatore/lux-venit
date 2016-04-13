'use strict';

// bundle io into our client instead of making the browser request it from 
// the socket instance itself.
import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import App from './app';
import store from './state';

const mount = document.querySelector('#mount');
const log = debug('lunina:client:main');
const socket = io.connect(getSocketUrl());

socket.on('message', data => {
  log('message from server', data);
  store.dispatch(data);
});

socket.on('connect', () => {
  log('connected to server: [ %s ]', getSocketUrl());
});

socket.on('connect_error', err => {
  log('connection error: %o', err);
});

socket.on('connection_timeout', err => {
  log('connection timeout: %o', err);
});

store.subscribe(() => {
  let state = store.getState();
  ReactDOM.render(<App color={state.color} />, mount);
})

function getSocketUrl() {
  let [ protocol, url ] = document.location.origin.split(':');
  return `${protocol}:${url}:${process.env.WSS_PORT}`;
}