//const exp = require('constants');
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeve
} = require('./utils/user')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname,'public')));
const servername = "server";


//widomosc jak ktosc dołczy
io.on('connection', socket =>{
    socket.on('joinRoom',({username,room}) =>{
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        socket.broadcast.to(user.room).emit('message',formatMessage(servername,`${user.username} dołczył` ));

        socket.emit('message',formatMessage(servername,'Witam na serverze'));

        //lista user

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    console.log('connetion');
// wypisz widomosc
   socket.on('chatMessage', msg => {
       const user = getCurrentUser(socket.id);

       io.to(user.room).emit('message',formatMessage(user.username,msg));
   })

   socket.on('disconnect', () => {
       const user = userLeve(socket.id);

       if(user){
        io.to(user.room).emit('message',formatMessage(servername,`${user.username} se poszedł`));}

    });
    
})
//

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running ${PORT}`));