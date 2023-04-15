var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

console.log('DEBUG: app started')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// from here bin/www
var debug = require('debug')('myapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3022');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const manipulate_socket = require('./socket');
manipulate_socket(server)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}




// let count = 0;
// let CLIENTS = []; // クライアントのリスト

// const io = require("socket.io")(server);
// io.on('connection', (socket) => {
//   console.log('socket 接続成功')
//   const id = Math.floor(Math.random() * 999999999);
//   console.log('新しいクライアント： ' + id);
//   const client = { id: id, socket: socket }
//   CLIENTS.push(client); //クライアントを登録
//   socket.send(count); // 現状のカウント情報を送信

//   socket.on('message', (message) => {
//     console.log('received: %s', message);
//     console.log(count)
//     if (message === 'kyosyu') {
//       count++;
//     }
//     else if (message === 'reset') {
//       count = 0;
//     }
//     else {
//       console.log('received undefined message.');
//     }
//     socket.send(count);
//     for (let j = 0; j < CLIENTS.length; j++) {
//       //他の接続しているクライアントにメッセージを一斉送信
//       const saved_socket = CLIENTS[j]['socket']
//       if (socket !== saved_socket) { saved_socket.send(count); }
//     }
//   })

//   socket.on('close', () => {
//     console.log('ユーザー：' + id + ' がブラウザを閉じました');
//     for (let j = 0; j < CLIENTS.length; j++) {
//       const saved_id = CLIENTS[j]['id'];
//       if (id !== saved_id) { delete CLIENTS[id]; }
//     }
//   });
// })

module.exports = app;
