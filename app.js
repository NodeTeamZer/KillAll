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
 * Using body parser module (API's post method).
 * @type {Parsers|*}
 */
const bodyParser = require("body-parser");

/**
 * Using helmet for better security.
 * @type {helmet}
 */
const helmet = require('helmet');

const path = require('path');
const ent = require('ent');


/**
 * Using router to define the different accesses.
 */
const router = express.Router();

/**
 * Stores the express app.
 */
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
/**
 * Stores the server listening port.
 * @type {number}
 */
const port = 3000;

/**
 * Stores the server host name.
 * @type {string}
 */
const host = "localhost";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use(helmet());
app.use(express.static(path.join(__dirname, 'assets'))); // set express to look in this folder for static files
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.disable('x-powered-by');

app.get('/', function(req, res){
	res.render('killAll.ejs', {title:"Kill All!"})
});

// Defining the default server access (game).
router.route("/").get(function(req, res) {
        io.sockets.on('connection', function (socket, dataConnexion) {
            socket.on('NewConnexion', function(dataConnexion) {
            let dataC = JSON.parse(dataConnexion);
            });
        });
});

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

app.listen(port, host, function(){
    console.log("Server available");
});