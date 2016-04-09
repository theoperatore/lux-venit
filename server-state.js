'use strict';

const createStore = require('redux').createStore;
const combineReducers = require('redux').combineReducers;

// rgba
const DEFAULT_COLOR = ['255', '255', '255', '1'];

function color(state, action) {
  switch (action.type) {
    case '/color':
      return action.color;
    default:
      return state ? state : DEFAULT_COLOR
  }
}

module.exports = createStore(combineReducers({ color }));