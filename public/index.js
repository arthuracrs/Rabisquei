document.addEventListener("DOMContentLoaded", () => {
    const socket = io.connect()

    var canvas = new fabric.Canvas("c");
    var text = new fabric.Textbox('Hello world From Fabric JS', {
        width: 250,
        cursorColor: "blue",
        top: 10,
        left: 10
    });

    canvas.add(text)

    socket.on('draw', (obj) => {
        canvas.loadFromJSON(obj)
    })

    canvas.on('after:render', (options) => {

    })

    canvas.on('object:modified', (options) => {
        const tempCanvasToEmit = JSON.stringify(canvas)
        socket.emit('object:modified', tempCanvasToEmit)
    })

    document.querySelector("#undo").addEventListener('click', () => {
        socket.emit('undo')
    })

    document.querySelector("#redo").addEventListener('click', () => {
       socket.emit('redo')
    })
})
