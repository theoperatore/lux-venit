'use strict';

import { createStore, combineReducers } from 'redux';

const DEFAULT_STATE = {
  rgba: ['51', '51', '51', '1'],
  fadeTime: '0'
}

function color(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'COLOR_CHANGE':
      return action.color;
    default:
      return state;
  }
}

export default createStore( combineReducers({ color }) )