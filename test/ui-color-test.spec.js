'use strict';

require('localenv');

import test from 'tape';
import OSC from 'node-osc';
import webdriver from 'selenium-webdriver';

let until = webdriver.until;
let By = webdriver.By;

let driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build();

let osc = new OSC.Client(process.env.OSC_SERVER_IP_ADDRESS, process.env.OSC_PORT);

function findBackgroundColor() {
  return driver.findElement(By.xpath("//div[@id='mount']/div")).then(content => {
    return content.getAttribute('style').then(style => {
      return /background-color\:\s+rgb\s*\(.+\)/.exec(style)[0];
    })
  })
}

test('Set background color correctly to 151 151 151', t => {
  t.plan(1);

  driver.get('http://localhost:9966').then(() => {
    osc.send('/color', ['151', '151', '151', '0'], err => {
      if (err) {
        t.fail(err);
        osc.kill();
        return;
      }
    })

    findBackgroundColor().then(color => {
      t.equals(color, 'background-color: rgb(151, 151, 151)', 'has background-color (151, 151, 151)');
    }).catch(err => {
      t.fail(err);
    })
  })
})

test('can change to a bunch of different colors', t => {
  t.plan(2);

  driver.get('http://localhost:9966').then(() => {
    osc.send('/color', ['0', '0', '0', '0'], err => {
      if (err) {
        t.fail(err);
        osc.kill();
        return;
      }
    })

    findBackgroundColor().then(color => {
      t.equals(color, 'background-color: rgb(0, 0, 0)', 'has background-color (0, 0, 0)');
    }).catch(err => {
      t.fail(err);
    }).then(() => {
      osc.send('/color', ['121', '161', '21', '0'], err => {
        if (err) {
          t.fail(err);
          osc.kill();
          return;
        }
      })

      findBackgroundColor().then(color => {
        t.equals(color, 'background-color: rgb(121, 161, 21)', 'has background-color (121, 161, 21)');
      }).catch(err => {
        t.fail(err);
      })

    })
  })
})

test.onFinish(() => {
  osc.kill();
  driver.quit();
})
