console.log("送信ボタンを押して下さい");
var sock = new WebSocket('wss://https://phantom-endurable-organization.glitch.me');
// var sock = new WebSocket('ws://localhost:3014');

sock.addEventListener('open', function (e) {// 接続
  console.log('Socket 接続成功');
});

sock.addEventListener('message', function (e) {// サーバーからデータを受け取る
  console.log(e.data);
  let count = e.data;
  elm = document.getElementById("counter");
  updated = '挙手数：' + count
  if (count == 0) {
    document.getElementById('kyosyu_image').style.display = 'none';
  } else if (count > 0) {
    document.getElementById('kyosyu_image').style.display = 'inline';
  }
  elm.textContent = updated;
});

document.addEventListener('DOMContentLoaded', function (e) {
  document.getElementById('kyosyu').addEventListener('click', function (e) {
    sock.send('kyosyu');
  });
});

document.addEventListener('DOMContentLoaded', function (e) {
  document.getElementById('reset_kyosyu').addEventListener('click', function (e) {
    sock.send('reset');
  });
});