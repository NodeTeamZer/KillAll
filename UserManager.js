const MySQLManager = require("./MySQLManager.js");

class UserManager extends MySQLManager {
    /**
     * UserManager's constructor, calling super and initializing default database table value.
     */
    constructor() {
        super();

        /**
         * Represents the user table name.
         * @type {string}
         */
        this.table = "user";

        /**
         * Stores the this.fields from the user table.
         * @type {string[]}
         */
        this.fields = ["id", "login", "password"];

        /**
         * Stores the query results.
         * @type {null}
         */
        this.results = null;
    }

    /**
     * From a request, checks the parameters given and create a new user entity into the database.
     * @param req The request to the server.
     * @param res The response from the server.
     */
    createAPI(req, res) {
        const login = this.connection.escape(req.query.login);
        const password = this.connection.escape(req.query.password);

        if (login === this.NULL || password === this.NULL) {
            res.json({error: "Missing arguments : {0} and {1} should be set.".format(this.fields[1], this.fields[2])});
        } else {
            this.query = "INSERT INTO `{0}`({1}, {2}) VALUES({3}, {4})"
                .format(this.table,
                    this.fields[1],
                    this.fields[2],
                    login,
                    password);

            this.connection.query(this.query, function (error) {
                if (error) {
                    console.log(error);

                    return;
                }

                res.json({result: "User successfully inserted."});
            });

            this.connection.end();
        }
    }

    /**
     * Creates a user into the database.
     * @param login The request to the server.
     * @param password The response from the server.
     */
    create(login, password) {
        if (login === this.NULL || password === this.NULL) {
            console.log("Missing arguments : {0} and {1} should be set.".format(this.fields[1], this.fields[2]));
        } else {
            this.query = "INSERT INTO `{0}`({1}, {2}) VALUES({3}, {4})"
                .format(this.table,
                    this.fields[1],
                    this.fields[2],
                    this.connection.escape(login),
                    this.connection.escape(password));

            this.connection.query(this.query, function (error) {
                if (error) {
                    console.log(error);

                    return;
                }

                console.log("User successfully inserted.");
            });

            this.connection.end();
        }
    }

    /**
     * Loads a user from the database depending on the login an password given.
     * @param login The user's login.
     * @param password The password associated to the login.
     * @param callback The callback function.
     */
    load(login, password, callback) {
        if (login === this.NULL || password === this.NULL) {
            return;
        } else {
            this.query = "SELECT * FROM `{0}` WHERE {1} = {2} AND {3} = {4}"
                .format(this.table,
                    this.fields[1],
                    this.connection.escape(login),
                    this.fields[2],
                    this.connection.escape(password));
        }

        this.connection.query(this.query, function (error, results) {
            if (error) {
                console.log(error);

                callback(results);
            }
        });

        this.connection.end();
    }

    /**
     * Used to authenticate the user when connecting.
     * @param login The user login.
     * @param password The user password.
     * @param callback The callback function.
     */
    authenticate(login, password, callback) {
        if (login === this.NULL || password === this.NULL) {
            console.log("Missing arguments : {0} and {1} should be set.".format(this.fields[1], this.fields[2]));
        } else {
            this.query = "SELECT {0} FROM `{1}` WHERE {2} = {3} AND {4} = {5}"
                .format(this.fields[0],
                    this.table,
                    this.fields[1],
                    this.connection.escape(login),
                    this.fields[2],
                    this.connection.escape(password));

            this.connection.query(this.query, function (error, results) {
                if (error) {
                    console.log(error);
                }

                callback(results[0].id);
            });

            this.connection.end();
        }
    }
}

module.exports = UserManager;