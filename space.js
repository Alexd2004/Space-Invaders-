// Board setup
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}






let shipImg;
let shipVelocityX = tileSize; // moves the ship with this speed

//alien gang
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //Number of aliens to defeat woot woot
let alienVelocityX = 1;

// Bullet setup
let bulletArray = [];
let bulletVelocityY = -10; // Speed of da bullet, negiative cause its moving toward zero (top)
let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("boardSpace");
    board.width = boardWidth;

    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board 
    
    // Drawing the ship specs
    // context.fillStyle="green";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //loading in images
    shipImg = new Image();
    shipImg.src = "./Spacephotos/player.png";
    shipImg.onload = function(){
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    alienImg = new Image(); 
    alienImg.src = "./Spacephotos/alien.png";
    createAliens();

   //Request sends loop to redraw
    requestAnimationFrame(update);
// what is event listener
    document.addEventListener("keydown", moveShip); //  Every time user presses a key down it will do moveship function

    document.addEventListener("keyup", shoot); //Key up meaning it needs to be released, like auto fire compared to keydown where auto fire / holding is okay



}

function update() {


    if (gameOver){
        return;
    }
    
    requestAnimationFrame(update)
    context.clearRect(0, 0, board.width, board.height);

    //Redraws the ship once it moves
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //Draw aliens
    for( let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive){
            alien.x += alienVelocityX

            // If alien touch border
            if(alien.x + alien.width >= board.width ||  alien.x <= 0) {
                alienVelocityX *= -1;

                //moves aliens up by one row
                for (let j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            }



            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if (alien.y >= ship.y){
                gameOver = true;
            }

        }
    }
    // bullets

    for (let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // bullet hits alien 
        for (let j=0; j < alienArray.length; j++){
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien))    { // alien needs to be alived and bullet to not be used
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;

            }
        }
    }

    //Will delete bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
        bulletArray.shift();
    }

    // Next level
    if (alienCount == 0) {
        // increases number of alines in columns and rows by 1
        alienColumns = Math.min(alienColumns + 1, columns/2 -2);    // columns/2 each alien width is 2 tile size and minus 2 since we always have space for alien to move
        alienRows = Math.min (alienRows + 1, rows -4 );              // Must have 4 rows space between ship and the aliens
        alienVelocityX += 0.2;                                      //Increase speed
        alienArray = [];
        bulletArray = [];                                             // sets new rounf

        createAliens();
    }
    //Score
    context.fillStyle="white";
    context.font="16px courier";
    context.fillText(score, 5, 20);


    // Round level

}

function moveShip(e) {
if (gameOver){
    return;
}

    if(e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0){
        ship.x -= shipVelocityX; // moves left
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // Moves right one tile 
    }
}


function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}


function shoot(e){
    if (gameOver){
        return;
    }

    if (e.code == "Space"){
        //shoot
        let bullet = {
            x : ship.x + shipWidth*15/32, //?,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && // a top left corner doesn't reach bs top right corner
        a.x + a.width > b.x && //a's top right corner passes b's top left corner
        a.y < b.y + b.height && // a's top left corner doesn't reach b bottem left corner
        a.y + a.height > b.y;  // a's bottem left corner pases b top left corner

}
