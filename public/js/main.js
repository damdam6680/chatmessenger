const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//username z url

const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});


const socket = io();


socket.emit('joinRoom',{username,room})

//lista userow

socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message',message => {
    console.log(message);
    outputmessage(message);

    chatMessage.scrollTop = chatMessage.scrollHeight;
});


chatForm.addEventListener('submit', e =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    console.log(msg);
    
    socket.emit('chatMessage',msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputmessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//dodaj room name do chat.hrml

function outputRoomName(room){
    roomName.innerText = room;
}
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

