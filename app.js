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
const app = express();

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
const path = require('path');
const ent = require('ent');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: 8889,
    database : 'killall'
});

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
	res.render('newGame.ejs', {title:"KillEmAll!"})
});
app.get('/combat', function(req, res) {
	res.redirect('/');
});
app.post('/combat', function(req, res) {
	if (req.body.user_name) {
		console.log(req.body);
		res.render('combat.ejs', {
			title:"combat - KillEmAll!"
			,user_name: req.body.user_name
			,user_attack_points: req.body.attack_points
			,user_defense_points: req.body.defense_points
			,user_agility_points: req.body.agility_points 
		});
	} else {
		res.redirect('/');
	}
});

io.sockets.on('connection', function (socket, data) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('NewPlayer', function(data) {
	let user_name = ent.encode(data['user_name']);
	let user_attack_points = ent.encode(data['user_attack_points']);
	let user_defense_points = ent.encode(data['user_defense_points']);
	let user_agility_points = ent.encode(data['user_agility_points']);
        socket.user_name = user_name;
	console.log('new player: '+ user_name+' with '+ user_attack_points +' attack points, '+ user_defense_points +' defense points and '+ user_agility_points +' agility points.');
    });
});

http.listen(port, function(){
    console.log('listening on *:3000');
});
