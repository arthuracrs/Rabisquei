
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socketIo = require("socket.io");
const io = new socketIo.Server(server);

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('draw', (obj) => {
        socket.broadcast.emit('draw', obj)
    })
});

server.listen(3030, () => {
    console.log('listening on *:3000');
});