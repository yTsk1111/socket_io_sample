function manipulate_socket(server) {

  let count = 0;
  let CLIENTS = []; // クライアントのリスト

  const io = require("socket.io")(server);
  io.on('connection', (socket) => {
    console.log('socket 接続成功')
    const id = Math.floor(Math.random() * 999999999);
    console.log('新しいクライアント： ' + id);
    const client = { id: id, socket: socket }
    CLIENTS.push(client); //クライアントを登録
    socket.send(count); // 現状のカウント情報を送信

    socket.on('message', (message) => {
      console.log('received: %s', message);
      console.log(count)
      if (message === 'kyosyu') {
        count++;
      }
      else if (message === 'reset') {
        count = 0;
      }
      else {
        console.log('received undefined message.');
      }
      socket.send(count);
      for (let j = 0; j < CLIENTS.length; j++) {
        //他の接続しているクライアントにメッセージを一斉送信
        const saved_socket = CLIENTS[j]['socket']
        if (socket !== saved_socket) { saved_socket.send(count); }
      }
      // CLIENTS.forEach(saved_client => {
      //   const saved_socket = saved_client.socket;
      //   if (socket !== saved_socket) { saved_socket.send(count); }
      // });
    })

    socket.on('close', () => {
      console.log('ユーザー：' + id + ' がブラウザを閉じました');
      for (let j = 0; j < CLIENTS.length; j++) {
        const saved_id = CLIENTS[j]['id'];
        if (id !== saved_id) { delete CLIENTS[id]; }
      }
    });
  })
}

module.exports = manipulate_socket;