const app = require('express')();
const ent = require('ent');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'killall'
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/killAll.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('NewPlayer', function(pseudo) {
            pseudo = ent.encode(pseudo);
            console.log('pseudo: '+pseudo);
            socket.pseudo = pseudo;
            socket.broadcast.emit('NewPlayer', pseudo);
        });
});



/*io.sockets.on('NewPlayer', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('Newplayer', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});*/