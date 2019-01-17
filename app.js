/**
 * String method definition used to copy the str.format() method from python.
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        const args = arguments;

        return this.replace(/{(\d+)}/g, function(match, number) {
            return (typeof args[number] != 'undefined') ? args[number] : match;
        });
    };
}

/**
 * Using express module.
 * @type {createApplication}
 */
const express = require("express");

/**
 * Using MySQL module.
 */
const mysql = require('mysql');

/**
 * Using helmet for better security.
 * @type {helmet}
 */
const helmet = require('helmet');

/**
 * Using router to define the different accesses.
 */
const router = express.Router();

/**
 * Stores the express app.
 */
const app = express();

const path = require('path');
const ent = require('ent');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const bodyParser = require('body-parser');

/**
 * Stores the server listening port.
 * @type {number}
 */
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use(helmet());
app.use(express.static(path.join(__dirname, 'assets'))); // set express to look in this folder for static files
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.disable('x-powered-by');

const CharacterManager = require("./CharacterManager.js");
const UserManager = require("./UserManager.js");
const characterManager = new CharacterManager();
const userManager = new UserManager();

// Defining the different character CRUD events depending on the method send to the route.
router.route("/api/characters").post(function(req, res){
    characterManager.createAPI(req, res);
}).get(function(req,res){
    characterManager.readAPI(req, res);
}).put(function(req,res){
    characterManager.updateAPI(req, res);
}).delete(function(req,res){
    characterManager.deleteAPI(req, res);
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('NewPlayer', function(pseudo) {
        pseudo = ent.encode(pseudo);
        console.log('pseudo: '+pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('NewPlayer', pseudo);
    });
});


app.get('/', function(req, res){
	res.render('killAll.ejs', {title:"Kill All!"})
});

http.listen(port, function(){
    console.log('listening on *:3000');
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