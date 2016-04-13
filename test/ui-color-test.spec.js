'use strict';

require('localenv');

import test from 'tape';
import OSC from 'node-osc';
import webdriver from 'selenium-webdriver';

const osc = new OSC.Client(process.env.OSC_SERVER_IP_ADDRESS, process.env.OSC_PORT);
const By = webdriver.By;
const WAIT_TIMEOUT = 3000;

const driver = new webdriver.Builder()
  .forBrowser('firefox') // built-in webdriver
  .build();

function waitForBackgroundColorToBe(color) {
  return driver.wait(() => {
    return driver.isElementPresent(By.xpath("//div[@id='mount']/div"))
  }, WAIT_TIMEOUT).then(() => {
    return driver.wait(() => {
      return driver.findElement(By.xpath("//div[@id='mount']/div")).then(content => {
        return content.getAttribute('style').then(style => {
          let testColor = /background-color\:\s+rgb\s*\(.+\)/.exec(style)[0];
          return testColor === `background-color: rgb(${color})`;
        })
      })
    }, WAIT_TIMEOUT);
  })
}

function sendColor(colorArr) {
  return new Promise((resolve, reject) => {
    osc.send('/color', colorArr, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    })
  })
}

test('E2E: ui changes colors with new state from server', t => {
  t.plan(4);

  driver.get('http://localhost:9966').then(() => {
    sendColor(['0', '0', '0', '0']).catch(err => t.fail(err));

    return waitForBackgroundColorToBe('0, 0, 0')
      .then(() => t.pass('has background-color (0, 0, 0)'))
      .catch(err => t.fail(err));

  }).then(() => {
    sendColor(['121', '161', '21', '0']).catch(err => t.fail(err));

    return waitForBackgroundColorToBe('121, 161, 21')
      .then(() => t.pass('has background-color (121, 161, 21)'))
      .catch(err => t.fail(err));

  }).then(() => {
    sendColor(['151', '151', '151', '0']).catch(err => t.fail(err));

    return waitForBackgroundColorToBe('151, 151, 151')
      .then(() => t.pass('has background-color (151, 151, 151)'))
      .catch(err => t.fail(err));
  }).then(() => {
    sendColor(['13', '33', '37', '0']).catch(err => t.fail(err));

    return waitForBackgroundColorToBe('13, 33, 37')
      .then(() => t.pass('has background-color (13, 33, 37)'))
      .catch(err => t.fail(err));
  })
})

test.onFinish(() => {
  osc.kill();
  driver.quit();
})


