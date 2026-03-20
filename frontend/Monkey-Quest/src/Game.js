import Maze from "./Maze.js";
import Obstacle from "./Obstacle.js";
import Player from "./Player.js";

class Game {
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.mazeObj = new Maze(11,11);
        this.player = null;
        this.obstacle = null;
    }

    async start(){
        await this.mazeObj.loadImages();
        let maze =this.mazeObj.create_maze()
        //debug
        console.log(this.mazeObj.entrance)
        console.log(this.mazeObj.exit)

        this.canvas.width = this.mazeObj.width*this.mazeObj.tileSize;
        this.canvas.height = this.mazeObj.height*this.mazeObj.tileSize;

        this.player = new Player(this, this.mazeObj.entrance.x, this.mazeObj.entrance.y);
        this.obstacle = new Obstacle(this.mazeObj);

        this.obstacle.loadQuestionAnimations();

        this.obstacle.find_path(maze,this.mazeObj.entrance,this.mazeObj.exit);
        this.obstacle.generateObstacles(1);

        this.loop();
    }

    handleWin(){
        alert("You reached the exit!");
    }

    loop = () => {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.mazeObj.draw_maze(this.ctx);
        if(this.player) this.player.draw();
        this.obstacle.draw_obstacle(this.ctx);

        requestAnimationFrame(this.loop);
    }
}

export default Game;

