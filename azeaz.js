
const path = require('path');
const ent = require('ent');
const io = require('socket.io').listen(http);



app.use(express.static(path.join(__dirname, 'assets'))); // set express to look in this folder for static files
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine


app.get('/', function(req, res){
	res.render('killAll.ejs', {title:"Kill All!"})
});

io.sockets.on('connection', function (socket, dataConnexion) {
    socket.on('NewConnexion', function(dataConnexion) {
        let dataC = JSON.parse(dataConnexion);
        
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
