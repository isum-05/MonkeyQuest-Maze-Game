
let player = {
    x:last_entrance ? last_entrance.x : 1,
    y:last_entrance ? last_entrance.y : 1
};


let direction = "down";   // default facing direction
let isMoving = false;

const playerImage = new Image();
playerImage.src = 'SpriteSheet/spriteSheet.png';
const spriteWidth = 64;
const spriteHeight = 64;
let gameFrame = 0;
const staggerFrames = 7;

const spriteAnimations = [];

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

animationStates.forEach((state,index)=>{
    let frames = {
        loc:[],
    }
    for(let j=0; j<state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x:positionX,y:positionY});
    }
    spriteAnimations[state.name] = frames;
});
//console.log(spriteAnimations);


function animatePlayer(){
    draw_maze(); // draw maze first
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
        spriteWidth,
        spriteHeight,
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

    if(maze[newY][newX] === open){
        player.x = newX;
        player.y = newY;
        winner(); // Check for win condition after valid move
    } else if(maze[newY][newX] === obstacle){
        player.x = newX;
        player.y = newY;
        askBananaQuestion(newX, newY);
    }
    else {
        isMoving = false;
    }
}
playerImage.onload = function(){
    animatePlayer();
};


function winner(){

    if(player.x === last_exit.x && player.y === last_exit.y){
        alert("Congratulations! You've reached the exit!");
        last_entrance = {x:player.x, y:player.y};
        animatePlayer();
    }
}

function askBananaQuestion(newX, newY){
    fetch('https://marcconrad.com/uob/banana/api.php?out=json')
    .then(response => response.json())
    .then(data => {
        const question = data.question;
        const answer = data.answer;

        let question_box = document.querySelector(".question_container");
        document.getElementById("question").innerHTML = `<img src="${question}" id="banana_question_img" alt="Banana Question">`;
        question_box.style.display = "flex";
        
        document.getElementById("banana_question_form").onsubmit = function(e){
            e.preventDefault();
            let user_answer = parseInt(document.getElementById("banana_answer").value);

            if(user_answer === answer){
                question_box.style.display = "none";
                maze[newY][newX] = open;
            }else{
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