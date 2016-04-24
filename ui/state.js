'use strict';

import { createStore, combineReducers } from 'redux';

const DEFAULT_STATE = {
  rgba: ['0', '0', '0', '1'],
  fadeTime: -1,
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