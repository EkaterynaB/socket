const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);
let usernames = [];

server.listen(process.env.port || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.sockets.on('connection', (socket) => {
    socket.on('new user', (data, callback) => {
        let userName = data[0].toUpperCase() + data.slice(1).toLowerCase();
        if (data === '') {
            callback('Insert your name');
        } else if (usernames.indexOf(userName) != -1) {
            callback('user has already exist');
        } else {
            callback(true);
            socket.username = userName;
            usernames.push(socket.username);
            updateUsernames();
        }
    });
    //Update Usernames
    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }
    //send message events

    socket.on('send message', (data) => {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //Disconnect
    socket.on('disconnect', (data) => {
        console.log(data);
        if (!socket.username) return;
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    })
});


