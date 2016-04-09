'use strict';

import { createStore, combineReducers } from 'redux';

function color(state = [51, 51, 51, 1], action) {
  switch (action.type) {
    case 'COLOR_CHANGE':
      return action.color.length === 4 
        ? action.color
        : state;
    default:
      return state;
  }
}

export default createStore( combineReducers({ color }) )