const path = require('path')
const express = require('express')
const PORT = 3000 || process.env.PORT
const http = require('http')
const socketio = require('socket.io')


const app = express()
//Create a server to use Socket io
const server = http.createServer(app)
const io = socketio(server);

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//This runs when client connects
io.on('connection', socket => {
    console.log("Socket connection ENABLED")

    //Client user conected
    socket.emit('message', 'I think we are conected :) this is your ID: ' + socket.client.id)

    //To everyone else
    socket.broadcast.emit()
})

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


//Socket io Emite de 3 formas:

//Para 1 Cliente 
// socket.emit()

// //Para todos los clientes exceto el cual hizo el event
// socket.broadcast.emit()

// //Para todos los clientes
// io.emit()