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

/**
 * Using router to define the different accesses.
 */
const router = express.Router();

/**
 * Stores the express app.
 */
const app = express();

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

// Defining the default server access (game).
router.route("/").get(function(req, res) {
        //Game access here
});

app.listen(port, host, function(){
    console.log("Server available at http://" + host + ":" + port);
});