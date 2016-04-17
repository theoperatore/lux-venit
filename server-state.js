'use strict';

const createStore = require('redux').createStore;
const combineReducers = require('redux').combineReducers;

const DEFAULT_STATE = { rgba: ['255', '255', '255'], fadeTime: 0 };

function color(state, action) {
  switch (action.type) {
    case process.env.OSC_AUDIENCE_ADDRESS:
      let includesFadeTime = action.data.length > 3;
      let fadeTime = 0;

      if (includesFadeTime) {
        let val = Number(action.data[action.data.length - 1]);
        fadeTime = isNaN(val) ? 0 : val;
      }

      return {
        rgba: action.data.slice(0, 3),
        fadeTime
      };

    default:
      return state ? state : DEFAULT_STATE;
  }
}

module.exports = createStore(combineReducers({ color }));