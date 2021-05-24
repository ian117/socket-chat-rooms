const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementsByClassName('chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


//Get Username & Room from URL with Qs lib
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Set the Room & User
socket.emit('joinRoom', {username, room})

//Get room & Users
socket.on('roomUsers', ({room, users}) => {
    outPutRoomName(room)
    outPutUsers(users)
})


socket.on('message', message => {
    outputMessage(message);

    //Scroll Down
    chatMessages[0].scrollTop = chatMessages[0].scrollHeight;
})

//Get value from Input
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();
})

const outputMessage = message => {
    const div = document.createElement('div');
    if (message.isServer){
        div.classList.add('messageServer');
    } else {
        div.classList.add('message');
    }
    div.textContent = '';

    const p = document.createElement('p');
    if (message.isServer) {
        p.classList.add('metaServer');
    } else {
        p.classList.add('meta');
    }
    p.textContent = `${message.username}`
   
    const pText = document.createElement('p');
    pText.classList.add('text');
    pText.textContent = `${message.text}`
    
    const span = document.createElement('span');
    span.textContent = `${message.time}`;
    p.appendChild(span)

    div.appendChild(p)
    div.appendChild(pText)
    chatMessages[0].appendChild(div)

}

function outPutRoomName(room) {
    roomName.textContent = room;
}

function outPutUsers(users) {
    //insertar en userlist li elements /p/ > array elemnts
    userList.textContent = null;
    users.map(user => {
        let li = document.createElement('li');
        li.textContent = user.username;
        userList.appendChild(li)
    })
}