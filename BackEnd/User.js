class User{
    constructor(name,level=0,coins=0){
        this.name = name;
        this.level = level;
        this.coins = coins;
        this.game = null;
        this.player = null;
        this.levelsBoard ={
            0:{goal:1000, profile:"img/Level/0.png"},
            1:{goal:2000, profile:"img/Level/1.png"},
            2:{goal:3500, profile:"img/Level/2.png"},
            3:{goal:5500, profile:"img/Level/3.png"},
            4:{goal:7000, profile:"img/Level/4.png"},
            5:{goal:10000, profile:"img/Level/5.png"}
        }
    }
    
    playerInit_level(){
        switch(this.level){
            case 0:
                this.game = new Game(11,11,1);
                break;
            case 1:
                this.game = new Game(13,13,2);
                break; 
            case 2:
                this.game = new Game(15,15,3);
                break;  
            case 3:
                this.game = new Game(15,15,4);
                break;
            case 4:
                this.game = new Game(17,17,5);
                break;
            case 5:
                this.game = new Game(17,17,6);
                break;
            default:
                this.game = new Game(11,11,1);
        }
        this.game.create_maze();

        this.player = new Player(this.game);
        
    }
    level_up() {
        const thresholds = [1000, 2000, 3500, 5500, 7000, 10000];

        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (this.coins >= thresholds[i]) {
                if (this.level !== i) {
                    this.level = i;
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    update_coins(coin){
        this.coins += coin;
    }

    failed_attempts(coin){
        this.coins -= coin;
    }

    claim_Coins({level,complete}){
        if(level === 0 && complete){
            this.coins = 500;
        }else if(level === 1 && complete) {
            this.coins += 1000;
        }else if(level === 2 && complete){
            this.coins += 1500;
        }else if(level === 3 && complete){
            this.coins += 2000;
        }else if(level === 4 && complete){
            this.coins += 2500;
        }else if(level === 5 && complete){
            this.coins += 3000;
        }else {
            this.coins = 0;
        }
    }

    save(){
        localStorage.setItem("User", JSON.stringify({
            name: this.name,
            level: this.level,
            coins: this.coins
        }));
        sessionStorage.setItem("ActiveSession", "true");
    }

    static load(){
        const data = localStorage.getItem("User");
        if (data) {
            const obj = JSON.parse(data);
            return new User(obj.name, obj.level, obj.coins);
        }
        return null;
    }

    gameLoop(){
        if(!this.game || !this.player) return;

        this.game.draw_maze();

        this.player.drawObstacles();

        this.player.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}