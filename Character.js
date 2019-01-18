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
     * kill_number representing the number of fight won by the character
     * @type {int}
     **/
    constructor(nickname, attack, defense, agility) {
        this.nickname = nickname;
        this.attack = attack;
        this.defense = defense;
        this.agility = agility;
        this.hp = 10;
        this.kill_number = 0;
        this.listener = {
            update(str) {
                this.string = str;
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
            let attack = this.dice();   
            if (attack <= this.attack){  // attack test
                return true;
            }else{
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
        }
    }
    
    /**
     *  fight beetween 2 character
     *  fight until one of the character has 0hp
     *  the winner increases his kill_number
     **/
    fight(Character){
        let heads = Math.random();
        while(this.hp > 0 || Character.hp > 0){     // while both characters have more than 0hp
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
        if (this.hp == 0){
            Character.kill_number++;
        }else {
            this.kill_number++;
        }
        this.hp = 10;                               
        Character.hp = 10;                          //both players recover there hp
    }
}