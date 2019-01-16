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
 * Represents the character table name.
 * @type {string}
 */
const table = "character";

/**
 * Stores the fields from the character table.
 * @type {string[]}
 */
const fields = ["id", "nickname", "attack", "defense", "agility", "hp", "kill_number"];

/**
 * Define the default kill number field value for new characters.
 * @type {number}
 */
const defaultKillNumber = 0;

/**
 * Defines the default character heath points.
 * @type {number}
 */
const defaultHP = 100;

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

/**
 * Stores the database connection information.
 * @type {Connection}
 */
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: 8889,
    database : 'killall'
});

/**
 * Used to represent escaped null value.
 * @type {string}
 */
const NULL = "NULL";


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

let query;

/**
 * From a request, checks the parameters given and create a new character entity into the database.
 * @param req The request to the server.
 * @param res The response from the server.
 */
function createEvent(req, res) {
    const nickname = connection.escape(req.query.nickname);
    const attack = connection.escape(req.query.attack);
    const defense = connection.escape(req.query.defense);
    const agility = connection.escape(req.query.agility);

    if (nickname === NULL || attack === NULL || defense === NULL || agility === NULL) {
        res.json({error: "Missing arguments : nickname, attack, defense and agility should be set."})
    } else {
        query = "INSERT INTO `character`({0}, {1}, {2}, {3}, {4}, {5}) VALUES {6}, {7}, {8}, {9}, {10}, {11})"
            .format(fields[1],
                fields[2],
                fields[3],
                fields[4],
                fields[5],
                fields[6],
                nickname,
                attack,
                defense,
                agility,
                defaultHP,
                defaultKillNumber);

        connection.query(query, function(error, results, fields) {
            if (error) {
                console.log(error);

                return;
            }

            res.json({result: "Character successfully inserted."});
        });
    }
}

/**
 * From a request / response, checks the parameters given and read the results from the database.
 * @param req The request to the server.
 * @param res The response from the server.
 */
function readEvent(req, res) {
    if (req.query.id == null) {
        query = "SELECT * FROM `{0}`".format(table);
    } else {
        query  = "SELECT * FROM `{0}` WHERE {1} = {2}".format(table, fields[0], req.query.id);
    }

    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error);

            return;
        }

        res.json({result: results});
    });
}

/**
 * From a request / response, checks the parameters given and update the associated entity into the database.
 * @param req The request to the server.
 * @param res The response from the server.
 */
function updateEvent(req, res) {
    const id = connection.escape(req.query.id);

    if (id === NULL) {
        res.json({error: "The id should be defined."});
    } else {
        let query = "UPDATE `" + table + "` SET ";
        let cpt = 1;

        for (key in req.query) {
            if (key !== "id") {
                query += key + " = " + connection.escape(req.query[key] + " ");

                if (cpt < (Object.keys(req.query).length)) {
                    query += ", "
                }
            }

            cpt++;
        }

        query += " WHERE " + fields[0] + " = " + id;

        connection.query(query, function(error, results, fields) {
            let jsonResult;

            if (error) {
                console.log(error);

                jsonResult = {error: "An error occurred with the entity update. See console for further information."};
            } else if (results.affectedRows === 0) {
                jsonResult = {error: "The entity with the id {0} doesn't exists, nothing changed.".format(id)};
            } else {
                jsonResult = {result: "Character successfully updated."};
            }

            res.json(jsonResult);
        });
    }
}

/**
 * From a request / response, checks the parameters given and delete the associated entity in the database.
 * @param req The request to the server.
 * @param res The response from the server.
 */
function deleteEvent(req, res) {
    const id = connection.escape(req.query.id);
    let jsonResult;

    if (id === NULL) {
        jsonResult = {error: "The id should be defined."};
    } else {
        query = "DELETE FROM `{0}` WHERE {1} = {2}".format(table, fields[0], id);

        connection.query(query, function(error, results, fields) {
            if (error) {
                console.log(error);

                jsonResult = {error: "An error occurred with the entity update. See console for further information."};
                return;
            } else if (results.affectedRows === 0) {
                jsonResult = {error: "The entity with the id {0} doesn't exists, nothing changed.".format(id)};
            } else {
                jsonResult = {result: "Character successfully deleted."};
            }

            res.json(jsonResult);
        });
    }
}

// Defining the different CRUD events depending on the method send to the route.
router.route("/characters").post(function(req, res){
    createEvent(req, res);
}).get(function(req,res){
    readEvent(req, res);
}).put(function(req,res){
    updateEvent(req, res);
}).delete(function(req,res){
    deleteEvent(req, res);
});

// Defining the default server access (game).
router.route("/").get(function(req, res) {
        //Game access here
});

app.listen(port, host, function(){
    console.log("Server available at http://" + host + ":" + port);
});