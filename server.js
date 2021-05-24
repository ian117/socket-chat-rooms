//Server > css with logic from the object of isServer: true/false

const path = require('path')
const express = require('express')
const PORT = process.env.PORT
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');
const { userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users')

const BotName = "Server"

const app = express()
//Create a server to use Socket io
const server = http.createServer(app)
const io = socketio(server);

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//This runs when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {

    const user = userJoin(socket.id,username, room)

    //Join a Room
    socket.join(user.room);

    //Client user conected
    socket.emit('message', formatMessage( BotName, `Hi ${user.username}, you arrive just in time for spaghetti!`, true))

    //To everyone else in ____ room when client connects
    socket.broadcast
    .to(user.room)
    .emit('message', formatMessage( BotName, 'The user '+ username +' has enter to room ' + '\> ' + user.room + ' \<', true))

    //Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })

    })

    //chatMessage
    socket.on('chatMessage', msg => {

        const user = getCurrentUser(socket.id)

        io
        .to(user.room)
        .emit('message',formatMessage( user.username, msg, false))
    })

   //Disconection
   socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
        io.to(user.room)
        .emit('message', formatMessage( BotName, `${user.username} just left :(`, true));
        
        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
     }
    })

})

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


//Socket io Emite de 3 formas:

//Para 1 Cliente 
// socket.emit()

// //Para todos los clientes exceto el cual hizo el event
// socket.broadcast.emit()

// //Para todos los clientes
// io.emit()