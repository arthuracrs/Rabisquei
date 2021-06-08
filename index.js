const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socketIo = require("socket.io");
const io = new socketIo.Server(server);

app.use(express.static(__dirname + '/public'))
// historic
let historic = []
let pointerHistoric = 0

function decreasePointerHistoric() {
    console.log('decrement chamado')
    
    if (pointerHistoric > 0) {
        pointerHistoric--
    }
}

function increasePointerHistoric() {
    
    console.log('increment chamado')
    
    if (pointerHistoric + 1 < historic.length) {
        pointerHistoric++
    }
}

io.on('connection', (socket) => {
    console.log('a user connected');
    
    if(historic.length != 0 ){
        io.emit('draw', historic[pointerHistoric])
    }
    
    // socket.on('draw', (obj) => {
    //     socket.broadcast.emit('draw', obj)
    // })

    socket.on('object:modified', obj => {

        if (pointerHistoric + 1 < historic.length && historic.length != 1) {
            historic = historic.slice(0, pointerHistoric + 1)
        }

        historic.push(obj)
        increasePointerHistoric()
        console.log('alteração')
        console.log('tamanho do historico: '+historic.length)
        console.log('posição: '+ pointerHistoric)
        console.log()
        socket.broadcast.emit('draw', obj)
    })

    socket.on('undo', obj => {
        decreasePointerHistoric()
        
        console.log('undo')
        console.log('tamanho do historico: '+historic.length)
        console.log('posição: '+ pointerHistoric)
        console.log()
        
        io.emit('draw', historic[pointerHistoric])
    })

    socket.on('redo', obj => {
        increasePointerHistoric()
        
        console.log('redo')
        console.log('tamanho do historico: '+historic.length)
        console.log('posição: '+ pointerHistoric)
        console.log()
        
        io.emit('draw', historic[pointerHistoric])
    })

});
const PORT = 3000
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
