const mysql = require('mysql');

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
 * Mother class of database managers, used to manage entities into databases.
 */
class MySQLManager {
    /**
     * MySQLManager's constructor initializing the attributes.
     */
    constructor() {
        this.connection = mysql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'root',
            port: 8889,
            database : 'killall'
        });

        this.query = "";
        this.NULL = "NULL";
        this.table ="";
        this.fields = [];
    }

    /**
     * From a request / response, checks the parameters given and read the results from the database.
     * @param req The request to the server.
     * @param res The response from the server.
     */
    readAPI(req, res) {
        const id = this.connection.escape(req.query.id);

        if (id === this.NULL) {
            this.query = "SELECT * FROM `{0}`".format(this.table);
        } else {
            this.query = "SELECT * FROM `{0}` WHERE {1} = {2}".format(this.table, this.fields[0], id);
        }

        this.connection.query(this.query, function (error, results) {
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
    updateAPI(req, res) {
        const id = this.connection.escape(req.query.id);

        if (id === this.NULL) {
            res.json({error: "The id should be defined."});
        } else {
            this.query = "UPDATE `" + this.table + "` SET ";
            let cpt = 1;

            for (let key in req.query) {
                if (key !== "id") {
                    this.query += key + " = " + this.connection.escape(req.query[key] + " ");

                    if (cpt < (Object.keys(req.query).length)) {
                        this.query += ", "
                    }
                }

                cpt++;
            }

            this.query += " WHERE " + this.fields[0] + " = " + id;

            this.connection.query(this.query, function (error, results) {
                let jsonResult;

                if (error) {
                    console.log(error);

                    jsonResult = {error: "An error occurred with the entity update. See console for further information."};
                } else if (results.affectedRows === 0) {
                    jsonResult = {error: "The entity with the id {0} doesn't exists, nothing changed.".format(id)};
                } else {
                    jsonResult = {result: "Entity successfully updated."};
                }

                res.json(jsonResult);

            });
        }
    }


}

module.exports = MySQLManager;
