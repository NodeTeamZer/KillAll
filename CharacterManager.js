const MySQLManager = require("./MySQLManager.js");
const UserManager = require("./UserManager.js");

/**
 * Manager class used to manage characters from database.
 */
class CharacterManager extends MySQLManager {
    /**
     * CharacterManager's constructor, calling super and initializing default database table value.
     */
    constructor() {
        super();

        /**
         * Represents the character table name.
         * @type {string}
         */
        this.table = "character";

        /**
         * Stores the this.fields from the character table.
         * @type {string[]}
         */
        this.fields = ["id", "nickname", "attack", "defense", "agility", "kills", "id_user"];

        /**
         * Define the default kill number field value for new characters.
         * @type {number}
         */
        this.defaultKillNumber = 0;
    }

    /**
     * From a request, checks the parameters given and create a new character entity into the database.
     * @param req The request to the server.
     * @param res The response from the server.
     */
    createAPI(req, res) {
        const nickname = this.connection.escape(req.query.nickname);
        const attack = this.connection.escape(req.query.attack);
        const defense = this.connection.escape(req.query.defense);
        const agility = this.connection.escape(req.query.agility);
        const idUser = this.connection.escape(req.query.id_user);

        if (nickname === this.NULL || attack === this.NULL || defense === this.NULL || agility === this.NULL) {
            res.json({error: "Missing arguments : nickname, attack, defense and agility should be set."})
        } else {
            this.query = "INSERT INTO `{0}`({1}, {2}, {3}, {4}, {5}, {6}) VALUES({7}, {8}, {9}, {10}, {11}, {12})"
                .format(this.table,
                    this.fields[1],
                    this.fields[2],
                    this.fields[3],
                    this.fields[4],
                    this.fields[5],
                    this.fields[6],
                    nickname,
                    attack,
                    defense,
                    agility,
                    this.defaultKillNumber,
                    idUser);

            this.connection.query(this.query, function (error) {
                if (error) {
                    console.log(error);

                    return;
                }

                res.json({result: "Character successfully inserted."});
            });


        }
    }

    /**
     * From a request / response, checks the parameters given and delete the associated entity in the database
     * (needs authentication).
     * @param req The request to the server.
     * @param res The response from the server.
     */
    deleteAPI(req, res) {
        const id = this.connection.escape(req.query.id);
        const login = this.connection.escape(req.query.login);
        const password = this.connection.escape(req.query.password);
        const userManager = new UserManager();

        let jsonResult;

        if (id === this.NULL || login === this.NULL || password === this.NULL) {
            jsonResult = {error: "The {0}, {2} and {3} should be defined."
                    .format(this.fields[0],
                        userManager.fields[1],
                        userManager.fields[2])};
        } else {
            userManager.authenticate(login, password, function (response) {
                let idUser = response;
                const characterManager = new CharacterManager();

                if (!idUser) {
                    res.json({error: "Authentication failed."});

                    return;
                }

                const query = "DELETE FROM `{0}` WHERE id = {1} AND {3} = {4}"
                    .format(characterManager.table,
                        characterManager.fields[0],
                        id,
                        characterManager.fields[7],
                        idUser);

                characterManager.connection.query(query, function (error, results) {
                    if (error) {
                        console.log(error);

                        jsonResult = {error: "An error occurred with the entity deletion. See console for further information."};

                        return;
                    } else if (results.affectedRows === 0) {
                        jsonResult = {error: "The entity with the id {0} doesn't exists, nothing changed.".format(id)};
                    } else {
                        jsonResult = {result: "Entity successfully deleted."};
                    }

                    res.json(jsonResult);
                });


            });
        }
    }

    /**
     * Creates a new character entity into the database.
     * @param nickname The nickname to set.
     * @param attack The attack to set.
     * @param defense The defense to set.
     * @param agility The agility to set.
     * @param idUser The id of the owner to set.
     */
    create(nickname, attack, defense, agility, idUser) {
        if (nickname === this.NULL || attack === this.NULL || defense === this.NULL || agility === this.NULL ||
            idUser === this.NULL) {
            console.log("Missing arguments : {1}, {2}, {3}, {4}, {5} and {6} should be set."
                .format(this.fields[1],
                    this.fields[2],
                    this.fields[3],
                    this.fields[4],
                    this.fields[5],
                    this.fields[6]));
        } else {
            this.query = "INSERT INTO `{0}`({1}, {2}, {3}, {4}, {5}, {6}) VALUES({7}, {8}, {9}, {10}, {11}, {12})"
                .format(this.table,
                    this.fields[1],
                    this.fields[2],
                    this.fields[3],
                    this.fields[4],
                    this.fields[5],
                    this.fields[6],
                    this.connection.escape(nickname),
                    this.connection.escape(attack),
                    this.connection.escape(defense),
                    this.connection.escape(agility),
                    this.defaultKillNumber,
                    this.connection.escape(idUser));

            this.connection.query(this.query, function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Character successfully inserted.");
                }


            });
        }
    }

    /**
     * From an id user, gets the list of characters associated and pass it to the callback method.
     * @param idUser The id of the user to load characters.
     * @param callback The callback function.
     */
    loadUserCharacters(idUser, callback) {
        this.query = "SELECT * FROM `{0}` WHERE {1} = {2}"
            .format(this.table,
                this.fields[6],
                this.connection.escape(idUser));
        let result;

        this.connection.query(this.query, function(error, results) {
            if (error) {
                console.log(error);

                return;
            }

            callback(results);

        });
    }

    /**
     * From an id user, gets the list of characters not owned by him and pass it to the callback method.
     * @param idUser The id of the user not to load characters.
     * @param callback The callback function.
     */
    loadOtherCharacters(idUser, callback) {
        this.query = "SELECT * FROM `{0}` WHERE {1} =! {2}"
            .format(this.table,
                this.fields[6],
                this.connection.escape(idUser));
        let result;

        this.connection.query(this.query, function(error, results) {
            if (error) {
                console.log(error);

                return;
            }

            callback(results);

        });
    }

    /**
     * Increase the number of kills by the number given in parameter.
     * @param id The id of the character to update.
     * @param nb The number to add to the existing kill number.
     */
    increaseKills(id) {
        this.query = "UPDATE {0} SET {1} = {2} + 1 WHERE {3} = {4}"
            .format(this.table,
                this.fields[5],
                this.fields[5],
                this.fields[0],
                this.connection.escape(id));

        this.connection.query(query, function(error) {
            if (error) {
                console.log(error);
            }


        });
    }
}

module.exports = CharacterManager;
