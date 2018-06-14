const getSign = require('./sign');
const byteLength = require('byte-length').byteLength;
const express = require('express');
const request = require('request-promise');
const bodyParser = require('body-parser');
const app = express();

const {
  qq,
  AppID,
  SecretID,
  SecretKey,
} = require('./config');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/example', express.static('example'));
app.use('/jquery', express.static('node_modules/jquery'));

app.post('/merge', function (req, res) {
  const sign = getSign();
  let data = "";
  req.on("data", function (chunk) {
    data += chunk;
  })
  req.on("end", function () {
    // console.log('data', img_data);
    data = JSON.parse(data);

    const img_data = data.img_data;
    const body = {
      "app_id": AppID,
      "img_data": img_data, // base64 编码后的输入图像
      "rsp_img_type": "url",
      "opdata": [{ //注意opdata是一个数组
        "cmd": "doFaceMerge",
        "params": {
          "model_id": data.model_id // 通用模板id
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
      res.send(data.body);
    }, (data) => {
      res.send(data.body);
    })
  })
});

var server = app.listen(3333, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
