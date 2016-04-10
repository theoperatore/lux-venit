'use strict';

require('localenv');

import test from 'tape';
import OSC from 'node-osc';
import webdriver from 'selenium-webdriver';

let By = webdriver.By;

let driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build();

let osc = new OSC.Client(process.env.OSC_SERVER_IP_ADDRESS, process.env.OSC_PORT);

function waitForBackgroundColorToBe(color) {
  return driver.wait(() => {
    return driver.findElement(By.xpath("//div[@id='mount']/div")).then(content => {
      return content.getAttribute('style').then(style => {
        let testColor = /background-color\:\s+rgb\s*\(.+\)/.exec(style)[0];
        return testColor === color;
      })
    })
  }, 10000);
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

    waitForBackgroundColorToBe('background-color: rgb(151, 151, 151)')
      .then(() => t.pass('has background-color (151, 151, 151)'))
      .catch(err => t.fail(err));
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

    return waitForBackgroundColorToBe('background-color: rgb(0, 0, 0)')
      .then(() => t.pass('has background-color (0, 0, 0)'))
      .catch(err => t.fail(err));
      
  }).then(() => {

    osc.send('/color', ['121', '161', '21', '0'], err => {
      if (err) {
        t.fail(err);
        osc.kill();
        return;
      }
    })

    return waitForBackgroundColorToBe('background-color: rgb(121, 161, 21)')
      .then(() => t.pass('has background-color (121, 161, 21)'))
      .catch(err => t.fail(err));

  })
})

test.onFinish(() => {
  osc.kill();
  driver.quit();
})
