document.addEventListener("DOMContentLoaded", () => {
    const socket = io.connect()

    let kk = false

    document.querySelector("#kk").addEventListener('click', () => {
        kk = !kk
        // console.log(kk)
    })

    var canvas = new fabric.Canvas("c");
    var text = new fabric.Textbox('Hello world From Fabric JS', {
        width: 250,
        cursorColor: "blue",
        top: 10,
        left: 10
    });

    canvas.add(text)

    socket.on('draw', (obj) => {

        // if (kk) {
            canvas.loadFromJSON(obj)
            console.log('sdas')
        // }

    })

    let historic = []
    let pointerHistoric = 0

    let tempCanvas = JSON.stringify(canvas)
    historic.push(tempCanvas)

    let saveCanvas = {}

    function decreasePointerHistoric() {
        if (pointerHistoric > 0) {
            pointerHistoric--
        }
    }

    function increasePointerHistoric() {
        if (pointerHistoric + 1 < historic.length) {
            pointerHistoric++
        }
    }

    canvas.on('after:render', (options) => {
        document.querySelector('#pointer').innerHTML = 'Pointer: ' + pointerHistoric
        document.querySelector('#length').innerHTML = 'Length: ' + historic.length
    })

    canvas.on('object:modified', (options) => {
        tempCanvas = JSON.stringify(canvas)

        if (pointerHistoric + 1 < historic.length && historic.length != 1) {
            historic = historic.slice(0, pointerHistoric + 1)
        }

        historic.push(tempCanvas)
        increasePointerHistoric()
        
        const tempCanvasToEmit = JSON.stringify(canvas)
        socket.emit('draw', tempCanvasToEmit)
    })

    document.querySelector("#save").addEventListener('click', () => {
        tempCanvas = JSON.stringify(canvas)
    })

    document.querySelector("#load").addEventListener('click', () => {
        canvas.loadFromJSON(tempCanvas)
    })

    document.querySelector("#undo").addEventListener('click', () => {
        decreasePointerHistoric()
        canvas.loadFromJSON(historic[pointerHistoric])
    })

    document.querySelector("#redo").addEventListener('click', () => {
        increasePointerHistoric()
        canvas.loadFromJSON(historic[pointerHistoric])
    })

    // console.log(JSON.stringify(canvas));//logs the string representation
    // console.log(canvas.toObject());//logs canvas as an object
    // console.log(canvas.toSVG());//logs the SVG representation of canvas
})