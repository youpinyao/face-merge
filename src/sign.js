const sha1 = require('sha1');
const fs = require('fs');
const base64_encode = require('js-base64').Base64.encode;

const {
  qq,
  AppID,
  SecretID,
  SecretKey,
} = require('./config');

const space = (60 * 60 * 1);
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
  original = cache.original;
} else {
  generate();
}

function generate() {
  t = parseInt(+(new Date()) / 1000);
  e = t + space;
  r = parseInt(Math.random() * 10000000000);
  original = `u=${qq}&a=${AppID}&k=${SecretID}&e=${e}&t=${t}&r=${r}&f=`;

  console.log('====================================');
  console.log('sign generate');
  console.log('====================================');

  fs.writeFileSync(cachePath, JSON.stringify({
    t,
    e,
    r,
    original,
  }));
}

module.exports = function () {
  // 超时重新生成
  if (e <= parseInt(+(new Date()) / 1000)) {
    generate();
  }

  const sign = base64_encode(sha1(original));

  return sign;
}
