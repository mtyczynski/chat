var connect = require("connect");
var app = connect();
var serveStatic = require('serve-static');

var httpServer = require("http").createServer(app);

var socketio = require("socket.io");
var io = socketio.listen(httpServer);

app.use(serveStatic("public"));

io.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        socket.emit("echo",  data);
        socket.broadcast.emit("echo", data);
    });
    socket.on("error", function (err) {
        console.dir(err);
    });
});

httpServer.listen(3000, function () {
    console.log('Serwer HTTP działa na pocie 3000');
});
