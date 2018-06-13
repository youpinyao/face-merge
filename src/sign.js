const crypto = require('crypto');
const fs = require('fs');

const {
  qq,
  AppID,
  SecretID,
  SecretKey,
} = require('./config');

const space = (60 * 60 * 24);
const cachePath = 'sign.json';

let t = null;
let e = null;
let r = null;
let original = null;

if (fs.existsSync(cachePath)) {
  const cache = JSON.parse(fs.readFileSync(cachePath));

  t = cache.t;
  e = cache.e;
  r = cache.r;
  original = new Buffer(cache.original);
} else {
  generate();
}

function generate() {
  t = parseInt(+(new Date()) / 1000);
  e = t + space;
  r = parseInt(Math.random() * 10000000000);
  const originalStr = `a=${AppID}&k=${SecretID}&e=${e}&t=${t}&r=${r}&u=${qq}`;

  original = new Buffer(originalStr);

  console.log('====================================');
  console.log('sign generate');
  console.log('====================================');

  fs.writeFileSync(cachePath, JSON.stringify({
    t,
    e,
    r,
    original: originalStr,
  }));
}

module.exports = function () {
  // 超时重新生成
  if (e <= parseInt(+(new Date()) / 1000)) {
    generate();
  }

  const sign = crypto.createHmac('sha1', SecretKey).update(original).digest();

  return (Buffer.concat([sign, original])).toString('base64');
}
