const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const ent = require('ent');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const mysql = require('mysql');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: 8889,
    database : 'killall'
});

app.use(express.static(path.join(__dirname, '/assets'))); // set express to look in this folder for static files
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine

http.listen(3000, function(){
  console.log('listening on *:3000');
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

io.sockets.on('connection', function (socket, user_data) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('NewPlayer', function(user_data) {
	let user_name = ent.encode(user_data['user_name']);
	let user_attack_points = ent.encode(user_data['user_attack_points']);
	let user_defense_points = ent.encode(user_data['user_defense_points']);
	let user_agility_points = ent.encode(user_data['user_agility_points']);
        socket.user_name = user_name;
	console.log('new player: '+ user_name+' with '+ user_attack_points +' attack points, '+ user_defense_points +' defense points and '+ user_agility_points +' agility points.');
    });
});
