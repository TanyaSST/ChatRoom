const express = require('express');
const app = express();
const formatMessage = require('./utils/messages')
const {joinUserToRoom,getUserById,userLeave,getUserRoom}=require('./utils/users');

//HTTP 
const http = require('http');
const server = http.createServer(app);
//Socket.IO
const socketIo = require('socket.io');
const io = socketIo(server);

// Wählen static Order
app.use(express.static('public',{
    extensions: ['html']
}))

//Variablen
const botName = 'Chatroom Bot';


io.on('connection', socket => {
    console.log('........UHU......');
    socket.on('joinRoom', ({ username, room }) => {
        const user=joinUserToRoom(socket.id, username, room);
        socket.join(user.room);

        //einzählne Nachricht
        socket.emit('message', formatMessage(botName, 'Wilkommen in Chatboard!'));

        //Verbreiten Nachrichten jeder User
        // mehrefache Nachrichtverbreitung ohne derjenige der garade angemeldet wurde
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} hat sich gerade angemeldet`));

        //Senden User und Roominformation
        io.to(user.room).emit('roomUser',{
            room:user.room,
            users:getUserRoom(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user= getUserById(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Läuft wenn User abgemeldet ist
    socket.on('disconnect', () => {
        const user= userLeave(socket.id);
        //an alle die Nachricht schicken
        if(user){
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} hat gedare das Chat verlassen`));
        }
        //Senden User und Roominformation
        io.to(user.room).emit('roomUser',{
            room:user.room,
            users:getUserRoom(user.room)
        });
    })
    

})
const PORT = 3000 || process.env.app;

server.listen(PORT, () => { console.log(`Server läuft auf Prot ${PORT}.`) })
