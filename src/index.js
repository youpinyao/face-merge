const getSign = require('./sign');
const byteLength = require('byte-length').byteLength;
const express = require('express');
const request = require('request-promise');
const app = express();

const {
  qq,
  AppID,
  SecretID,
  SecretKey,
} = require('./config');

const pic = require('./pic');

app.get('/merge', function (req, res) {
  const sign = getSign();

  const body = {
    "app_id": AppID,
    // "project": "youtu",
    // "sid": "cf_lover_fanli",
    // "raw_base64": pic, // base64 编码后的输入图像
    "img_data": pic, // base64 编码后的输入图像
    "rsp_img_type": "url",
    "opdata": [{ //注意opdata是一个数组
      "cmd": "doFaceMerge",
      "params": {
        "model_id": "cf_lover_fanli" // 通用模板id
      }
    }]
  };

  request({
    method: 'POST',
    uri: 'http://api.youtu.qq.com/cgi-bin/pitu_open_access_for_youtu.fcg',
    json: true,
    resolveWithFullResponse: true,
    headers: {
      'Host': 'api.youtu.qq.com',
      'Content-Type': 'text/json',
      'Authorization': sign,
      'Content-Length': byteLength(JSON.stringify(body))
    },
    body,
  }).then(data => {
    res.send(data);
  }, (data) => {
    res.send(data);
  })

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
