'use strict';

let leveldb = require('level');

module.exports = function createDb(cb) {
  leveldb('./lux-venit-db', { createIfMissing: true, valueEncoding: { encode: JSON.stringify, decode: JSON.parse } }, (e, db) => {
    if (e) throw e;

    db.get('color', (err, data) => {
      if (err) {
        if (err.notFound) {
          cb(db);
          return;
        }

        throw err;
      }

      cb(db, data);
    })
  });
}