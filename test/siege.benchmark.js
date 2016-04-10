'use strict';

require('localenv');

let siege = require('siege');

siege('node server.js')
  .on(process.env.HTTP_PORT)
  .wait(2000)
  .for(10000).times
  .get('/')
  .attack();