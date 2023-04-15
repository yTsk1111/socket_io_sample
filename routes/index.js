var express = require('express');
var router = express.Router();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3014 });

let count = 0;
let CLIENTS = []; // クライアントのリスト
let id;
wss.on('connection', function connection(ws) {
  id = Math.floor(Math.random() * 999999999);
  console.log('新しいクライアント： ' + id);
  const client = { id: id, ws: ws }
  CLIENTS.push(client); //クライアントを登録
  ws.send(count); // 現状のカウント情報を送信
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if (message === 'kyosyu') {
      count++;
    }
    else if (message === 'reset') {
      count = 0
    }
    else {
      console.log('received undefined message.')
    }
    ws.send(count);
    for (let j = 0; j < CLIENTS.length; j++) {
      //他の接続しているクライアントにメッセージを一斉送信
      const saved_ws = CLIENTS[j]['ws']
      if (ws !== saved_ws) { saved_ws.send(count); }
    }
  });
  ws.on('close', function () {
    console.log('ユーザー：' + id + ' がブラウザを閉じました');
    for (let j = 0; j < CLIENTS.length; j++) {
      const saved_id = CLIENTS[j]['id'];
      if (id !== saved_id) { delete CLIENTS[id]; }
    }
  });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
