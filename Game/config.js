
let player = {
    x:last_entrance ? last_entrance.x : 1,
    y:last_entrance ? last_entrance.y : 1
};


let direction = "down";   // default facing direction
let isMoving = false;

const playerImage = new Image();
playerImage.src = 'SpriteSheet/spriteSheet.png';

const questionImage = new Image();
questionImage.src = 'SpriteSheet/spriteSheet_2_mini.png';






const spriteWidth ={
    "player":64,
    "question":26
}
const spriteHeight = {
    "player":64,
    "question":27
}


let gameFrame = 0;
const staggerFrames = 7;

const questionStagger = 10;
let questionFrame = 0;

const spriteAnimations = {};

const questionAnimations = {};

const animationStates = [
    { 
        name:"back",
        frames:8
    },

    {
        name:"back_left",
        frames:6
    },
    {
        name:"side_left",
        frames:10
    },

    {
        name:"front_left",
        frames:8
    },

    {
        name:"front",
        frames:11
    },

    {
        name:"front_right",
        frames:8
    },

    {
        name:"side_right",
        frames:12
    },

    {
        name:"back_right",
        frames:6
    },

    {
        name:"jump",
        frames:15
    },

    {
        name:"roll",
        frames:6
    },
];

const questionAnimationStates = [
    {
        name:"banana_question",
        frames:8
    }];

questionAnimationStates.forEach((state,index)=>{
    let frames = {
        loc:[],
    }
    for(let j=0; j<state.frames; j++){
        let positionX = j * (spriteWidth.question + 1.97);
        let positionY = index * spriteHeight.question;
        frames.loc.push({x:positionX,y:positionY});
    }
    questionAnimations[state.name] = frames;
});

animationStates.forEach((state,index)=>{
    let frames = {
        loc:[],
    }
    for(let j=0; j<state.frames; j++){
        let positionX = j * spriteWidth.player;
        let positionY = index * spriteHeight.player;
        frames.loc.push({x:positionX,y:positionY});
    }
    spriteAnimations[state.name] = frames;
});
//console.log(spriteAnimations);

function animateQuestion(positionX, positionY){

    let animation = questionAnimations["banana_question"];

    let frameIndex = Math.floor(questionFrame / questionStagger) % animation.loc.length;

    let frameX = animation.loc[frameIndex].x;
    let frameY = animation.loc[frameIndex].y;
    
    ctx.drawImage(
        questionImage,
        frameX,
        frameY,
        spriteWidth.question,
        spriteHeight.question,
        positionX,
        positionY,
        tile_size,
        tile_size
    );
    questionFrame++;
}


function animatePlayer(){
    draw_maze(); // draw maze first
    draw_obstacles(); // draw obstacles on top of maze
    let positionX = player.x * tile_size;
    let positionY = player.y * tile_size;

    // Choose animation based on direction
    let animation = spriteAnimations["front"];

    if(direction === 'up'){
        animation = spriteAnimations['back'];
    }
    else if(direction === 'down'){
        animation = spriteAnimations['front'];
    }
    else if(direction === 'left'){
        animation = spriteAnimations['side_left'];
    }
    else if(direction === 'right'){
        animation = spriteAnimations['side_right'];
    }

    let frameIndex = 0;

    if(isMoving){
        frameIndex = Math.floor(gameFrame / staggerFrames) % animation.loc.length;
        gameFrame++;
    }

    let frameX = animation.loc[frameIndex].x;
    let frameY = animation.loc[frameIndex].y;

    ctx.drawImage(
        playerImage,
        frameX,
        frameY,
        spriteWidth.player,
        spriteHeight.player,
        positionX,
        positionY,
        tile_size,
        tile_size
    );

    requestAnimationFrame(animatePlayer);
}


document.addEventListener("keydown", handleKey);


function handleKey(event){

    let newX = player.x;
    let newY = player.y;

    isMoving = true;

    if(event.key === 'ArrowUp'){
        newY--;
        direction = 'up';
    }
    else if(event.key === 'ArrowDown'){
        newY++;
        direction = 'down';
    }
    else if(event.key === 'ArrowLeft'){
        newX--;
        direction = 'left';
    }
    else if(event.key === 'ArrowRight'){
        newX++;
        direction = 'right';
    }
    else{
        isMoving = false;
        return;
    }

    tryMove(newX, newY);
}
function tryMove(newX, newY){

    if(newX < 0 || newY < 0 || newX >= width || newY >= height){
        isMoving = false;
        return;
    }

    if(maze[newY][newX] === closed){
        isMoving = false;
        return;
    }

    let obstacleAtNewPos = getObstacleAt(newX, newY);

    if(obstacleAtNewPos){
        askBananaQuestion(newX, newY);
        return;
    }

    player.x = newX;
    player.y = newY;

    winner();
}
playerImage.onload = function(){
    animatePlayer();
};


function winner(){

    if(player.x === last_exit.x && player.y === last_exit.y){
        alert("Congratulations! You've reached the exit!");
        last_entrance = {x:player.x, y:player.y};
    }
}

function askBananaQuestion(newX, newY){
    isMoving = false;
    fetch('https://marcconrad.com/uob/banana/api.php?out=json')
    .then(response => response.json())
    .then(data => {
        const question = data.question;
        const answer = Number(data.solution);

        let question_box = document.querySelector(".question_container");
        document.getElementById("question").innerHTML = `<img src="${question}" id="banana_question_img" alt="Banana Question">`;
        question_box.style.display = "flex";
        
        document.getElementById("banana_question_form").onsubmit = function(e){
            e.preventDefault();
            let user_answer = Math.round(Number(document.getElementById("range3").value));

            if(user_answer === answer){
                question_box.style.display = "none";

                removeObstacle(newX, newY);   // remove obstacle

                player.x = newX;              // allow movement
                player.y = newY;
            }else{
                console.log("Incorrect answer. Try again!");
                document.querySelector(".alert").innerHTML = "Incorrect! Try again.";
                setTimeout(() => {
                        question_box.style.display = "none";
                        player.x = last_entrance.x;
                        player.y = last_entrance.y;
                }, 2000);
            }
        }
    })
    .catch(error => {
        console.error('Error fetching banana question:', error);
        player.x = 1;
        player.y = 1;
    });
}

function getObstacleAt(x,y){

    for(let i=0;i<obstacle.length;i++){
        if(obstacle[i].x === x && obstacle[i].y === y){
            return obstacle[i];
        }
    }

    return null;
}
function removeObstacle(x,y){

    obstacle = obstacle.filter(o => !(o.x === x && o.y === y));

}



//styling asthetics 

const sliderEl3 = document.querySelector("#range3")
const sliderValue3 = document.querySelector(".value3")

sliderEl3.addEventListener("input", (event) => {
  const tempSliderValue = Number(event.target.value); 
  
  sliderValue3.textContent = tempSliderValue; 
  
  const progress = (tempSliderValue / sliderEl3.max) * 100;
 
  sliderEl3.style.background = `linear-gradient(to right, #f50 ${progress}%, #ccc ${progress}%)`;
  
  sliderEl3.style.setProperty("--thumb-rotate", `${(tempSliderValue/100) * 2160}deg`)
})