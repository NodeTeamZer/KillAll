class Character {
    /**
     * Instenciation of a new character with 4 parameters
     * nickname representing the nickname of the new character
     * @type {string}
     * attack representing the attack's score of the new character
     * @type {int}
     * defense representing the defense's score of the new character
     * @type {int}
     * agility representing the agility's score of the new character
     * @type {int}
     * hp reprensenting the health's point of the new character
     * @type {int}
     * kills representing the number of fight won by the character
     * @type {int}
     **/
    constructor(id, nickname, attack, defense, agility) {
        this.id = id;
        this.nickname = nickname;
        this.attack = attack;
        this.defense = defense;
        this.agility = agility;
        this.hp = 10;
        this.kills = 0;
        this.listener = {
            update(str) {
                this.string += '<br>'+str;
            },

            getString() {
                return this.string;
            }
        };
    }
    
    /**
     * return a random number beetween 1 and 9
     * @type {int}
     **/
    dice(){
        let min = 1;
        let max = 10;
        return (Math.floor(Math.random() * (max - min)) + min);
    }
    
    /**
     * the character attack another one
     * return true if he succeed
     * @type {bool}
     * return false if not
     * @type {bool}
     **/
    actionAttack(){
        let agility = this.dice();

        if (agility <= this.agility){  // agility test
            this.listener.update(this.nickname+" tente d'attaquer !!")
            let attack = this.dice();   
            if (attack <= this.attack){  // attack test
                this.listener.update(this.nickname+" <span style='color: gold'>réussit son attaque !!</span>")
                return true;
            }else{
                this.listener.update(this.nickname+" <span style='color: tomato'>échoue dans son attaque...</span>")
                return false;
            }
        }
        else{
            return false;
        }
    }
    
    /**
     *  the character defend himself 
     *  if he fails he looses 1hp 
     **/
    actionDefense(){
        let defense = this.dice();
        if (defense > this.defense){  // defense test
            this.hp--;                // loose 1hp
            this.listener.update(this.nickname+" ne parvient pas à défendre et <strong>perd 1 point de vie !!</strong> Il lui reste "+this.hp);
        }else{
            this.listener.update(this.nickname+" <span style='color: skyblue'>parvient à bloquer l'attaque !!</span>")
        }
    }
    
    /**
     *  fight beetween 2 character
     *  fight until one of the character has 0hp
     *  the winner increases his kill_number
     **/
    fight(Character){
        let heads = Math.random();
        while(this.hp > 0 && Character.hp > 0){     // while both characters have more than 0hp
            if (heads < 0,5){                       // heads or tails to know who start
                if (this.actionAttack()){           // player1 tries to attack
                    Character.actionDefense();      // player2 tries to defend himself
                }
                if (Character.actionAttack()){      // player2 tries to attack
                    this.actionDefense();           // player1 tries to defend himsel
                }
            }else{                                  // same actions for the other side of the coin
                if (Character.actionAttack()){
                    this.actionDefense();
                }
                if (this.actionAttack()){
                    Character.actionDefense();
                }
            }
        }
        let winner = 0;
        if (this.hp == 0){
            Character.kills++;
            this.listener.update(Character.nickname+" <span style='color: red'>a tué votre champion... VOUS PERDEZ LE COMBAT :(:(:(:(</span>. "+Character.nickname+" est victorieux avec "+Character.hp+"hp restant.");
            winner = Character.id;
        }else {
            this.kills++;
            this.listener.update(this.nickname+" tue son adversaire et  <span style='color: green'>REMPORTE LE COMBAT !!!!!!</span> Tout ca avec "+this.hp+"hp restant.");
            this.listener.update(Character.nickname+" <span style='color: darkred'>est mort....</span>");
            winner = this.id;
        }
        this.hp = 10;                               
        Character.hp = 10;                          //both players recover there hp
        return winner;
    }
}