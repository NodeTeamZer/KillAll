// As I have the habit of Python String.format() method, redefining it here.
if (!String.prototype.format) {
    String.prototype.format = function() {
        const args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return (typeof args[number] != 'undefined') ? args[number] : match;
        });
    };
}

const table = "character";
const fields = ["id", "nickname", "attack", "defense", "agility", "hp", "kill_number"];
const defaultKillNumber = 0;
const defaultHP = 100;

const deleteStatement = "DELETE FROM `character WHERE id = {id}`";


const express = require("express");
const mysql = require('mysql');
const bodyParser = require("body-parser");
const router = express.Router();

const app = express();
const port = 3000;
const host = "localhost";
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: 8889,
    database : 'killall'
});
const NULL = "NULL";


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

let query;

// From a request, checks the parameters given and create a new character entity into the database.
function createEvent(req) {
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

// From a request / response, checks the parameters given and read the results from the database.
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


// From a request / response, checks the parameters given and update the associated entity into the database.
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
            if (error) {
                console.log(error);

                return;
            }

            res.json({result: "Character successfully updated."});
        });
    }
}


// From a request / response, checks the parameters given and delete the associated entity in the database.
function deleteEvent(req, res) {
    const id = connection.escape(req.query.id);

    if (id === NULL) {
        res.json({error: "The id should be defined."});
    } else {
        query = "DELETE FROM `{0}` WHERE {1} = {2}".format(table, fields[0], id);

        connection.query(query, function(error, results, fields) {
            if (error) {
                console.log(error);

                return;
            }

            res.json({result: "Character successfully deleted."});
        });
    }
}


router.route("/characters").post(function(req, res){
    createEvent(req, res);
}).get(function(req,res){
    readEvent(req, res);
}).put(function(req,res){
    updateEvent(req, res);
}).delete(function(req,res){
    deleteEvent(req, res);
});

router.route("/").get(function(req, res) {
        //Game access here
});

app.listen(port, host, function(){
    console.log("Mon serveur fonctionne sur http://"+ host +":"+port);
});