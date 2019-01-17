class Character {
    constructor(nickname, attack, defense, agility){
        this.nickname = nickname;
        this.attack = attack;
        this.defense = defense;
        this.agility = agility;
        this.hp = 10;
        this.kill_number = 0;
    }
    
    dice(){
        let min = 1;
        let max = 10;
        return (Math.floor(Math.random() * (max - min)) + min);
    }
    
    actionAttack(){
        let agility = this.dice();
        if (agility <= this.agility){
            let attack = this.dice();
            if (attack <= this.attack){
                return true;
            }else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    
    actionDefense(){
        let defense = this.dice();
        if (defense > this.defense){
            this.hp--;
        }
    }
    
    fight(Character){
        let heads = Math.random();
        while(this.hp > 0 || Character.hp > 0){
            if (heads < 0,5){
                if (this.actionAttack()){
                    Character.actionDefense();
                }
                if (Character.actionAttack()){
                    this.actionDefense();
                }
            }else{
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
        Character.hp = 10;
    }
    
}