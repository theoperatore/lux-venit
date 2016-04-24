'use strict';

require('localenv');

let async = require('async');
let OSC = require('node-osc');

const osc = new OSC.Client('127.0.0.1', process.env.OSC_PORT);

function sendColor(colorArr) {
  return new Promise((resolve, reject) => {
    osc.send('/dwdevices', colorArr, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    })
  })
}


const ITERATIONS = 1000;

let sequences = [];
for (var i = 0; i < ITERATIONS; i++) {
  sequences.push(function go(cb) {
    setTimeout(() => {
      let r = Math.round(Math.random() * 255);
      let g = Math.round(Math.random() * 255);
      let b = Math.round(Math.random() * 255);
      let t = Math.round(Math.random() * 5000);

      sendColor([r, g, b, t])
        .then(() => cb())
        .catch(cb);
    }, Math.random() * 1000);
  })
}

let start = Date.now();
async.series(sequences, err => {
  if (err) throw err;

  console.log('total time: %d sec', (Date.now() - start) / 1000);
  osc.kill();
})