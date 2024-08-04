const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const GAME_WIDTH = canvas.width = 576;
const GAME_HEIGHT = canvas.height = 912;
const levelUI = document.getElementById("level");
const startGameUI = document.getElementById("startGame");
const powerup = document.getElementById("powerup");
powerup.volume = 0.4;
const hit = document.getElementById("hit");
hit.volume = 0.2;
const shoot = document.getElementById("shoot");
shoot.volume = 0.1;
let laserMax = 5;

const inputMap = {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
    fire: "Space",
    hasFired: false
}

let currentLevel = 1;
let laserArray = [];
let bulletUsed = 0;
let nextLevel = 200;
function applyLevel(){
    levelUI.innerHTML = "Level: " +  currentLevel;
    startGameUI.style.visibility = "visible";
    if(currentLevel % 4 == 0){
        if(player.width <= 64) {
            player.width *= 2;
            player.height *= 2;
        } else {
            player.width *= 0.5;
            player.height *= 0.5
        }
        miniPlayers.push(new MiniPlayer(0, 0, 0, 0, 0));
    }
    setTimeout(clearLevel, 5000);
}

function clearLevel(){
    startGameUI.style.visibility = "hidden";
}

class Player{
    constructor(x, y, width, height, shrink){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.shrink = shrink;
        this.collisionX = this.x + this.shrink;
        this.collisionY = this.y + this.shrink;
        this.collisionWidth = this.width - this.shrink * 2;
        this.collisionHeight = this.height - this.shrink;
    }
    update(){
        if(input.keys.includes(inputMap.left) == true) this.x -= 8;
        else if (input.keys.includes(inputMap.right) == true) this.x += 8;
        if(input.keys.includes(inputMap.down) == true) this.y += 10, this.y < GAME_HEIGHT - this.height? colorStamp+=0.001:null;
        else if (input.keys.includes(inputMap.up) == true) this.y -= 10, this.y > GAME_HEIGHT * 0.2? colorStamp -= 0.001:null;
        this.updateCoordinates();
    }
    draw(ctx){
        if(inputMap.hasFired && ui.bullet) {
            shoot.play();
            switch(true){
                case currentLevel > 0 && currentLevel <= 2:
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 3, this.y - 26, 8, 26, "white", "red")), this.timingLaser = 0;
                    bulletUsed++;
                    break;
                case currentLevel > 2 && currentLevel <= 5:
                    laserArray.push(new Laser(this.x + this.width * 0.5 + 12, this.y - 20, 3, 20, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 3, this.y - 30, 8, 30, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 10, this.y - 20, 3, 20, "white", "red"));
                    this.timingLaser = 0;
                    bulletUsed++;
                    break;
                case currentLevel > 5 &&  currentLevel <= 14:
                    laserArray.push(new Laser(this.x + this.width * 0.5 + 17 + 5, this.y - 14, 3, 14, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 + 10, this.y - 24, 5, 24, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 6, this.y - 32, 12, 32, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 15, this.y - 24, 5, 24, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 22 - 5, this.y - 14, 3, 14, "white", "red"));
                    this.timingLaser = 0;
                    bulletUsed++;
                    break;
                case currentLevel > 14:
                    laserArray.push(new Laser(this.x + this.width * 0.1 - 1.5, this.y - 4, 3, 4, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.2 - 1.5, this.y - 14, 3, 14, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.3 - 3, this.y - 28, 6, 28, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.4 - 4, this.y - 38, 8, 38, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 6, this.y - 52, 12, 52, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.6 - 4, this.y - 38, 8, 38, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.7 - 3, this.y - 28, 6, 28, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.8 - 1.5, this.y - 14, 3, 14, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.9 - 1.5, this.y - 4, 3, 4, "white", "red"));
                    this.timingLaser = 0;
                    bulletUsed++;
                    break;
            }
        };
        inputMap.hasFired = false;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "deepskyblue";
        ctx.fillRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);
        if(ui.bazooka < 40){
            ctx.strokeStyle = "gray";
            ctx.strokeRect(this.collisionX + this.collisionWidth / 2, 0, 2, this.collisionY);
        }
    }
    updateCoordinates(){
        this.x = Math.max(0, Math.min(this.x, GAME_WIDTH - this.width));
        this.y = Math.max(GAME_HEIGHT * 0.2, Math.min(this.y, GAME_HEIGHT - this.height))
        this.collisionX = this.x + this.shrink;
        this.collisionY = this.y + this.shrink;
        this.collisionWidth = this.width - this.shrink * 2;
        this.collisionHeight = this.height - this.shrink;
    }
}

class MiniPlayer extends Player{
    constructor(x, y, width, height, shrink){
        super(x, y, width, height, shrink);
        this.width = 64;
        this.height = 64;
        this.shrink = 10;
        this.x = 0;
        this.y = GAME_HEIGHT - this.height;
        this.collisionX = this.x + this.shrink;
        this.collisionY = this.y + this.shrink;
        this.collisionWidth = this.width - this.shrink * 2;
        this.collisionHeight = this.height - this.shrink;
        this.kills = 0;
        this.dx = 1;
        this.shootTime = 100;
        this.markedForDeletion = false;
    }
    update(){
        this.x += this.dx;
        if(this.x + this.width > GAME_WIDTH || this.x <= 0) this.dx = -this.dx;
        this.updateCoordinates();
    }
    draw(ctx, deltaTime){
        if (this.shootTime < 0) {
            shoot.play();
            switch(true){
                case this.kills < 20:
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 3, this.y - 26, 8, 26, "white", "red")), this.timingLaser = 0;
                    break;
                case this.kills < 50:
                    laserArray.push(new Laser(this.x + this.width * 0.5 + 12, this.y - 20, 3, 20, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 3, this.y - 30, 8, 30, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 10, this.y - 20, 3, 20, "white", "red"));
                    break;
                case this.kills < 70:
                    laserArray.push(new Laser(this.x + this.width * 0.5 + 17 + 5, this.y - 14, 3, 14, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 + 10, this.y - 24, 5, 24, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 6, this.y - 32, 12, 32, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 15, this.y - 24, 5, 24, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 22 - 5, this.y - 14, 3, 14, "white", "red"));
                    break;
                case this.kills <= 120:
                    laserArray.push(new Laser(this.x + this.width * 0.1 - 1.5, this.y - 4, 3, 4, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.2 - 1.5, this.y - 14, 3, 14, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.3 - 3, this.y - 28, 6, 28, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.4 - 4, this.y - 38, 8, 38, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.5 - 6, this.y - 52, 12, 52, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.6 - 4, this.y - 38, 8, 38, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.7 - 3, this.y - 28, 6, 28, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.8 - 1.5, this.y - 14, 3, 14, "white", "red"));
                    laserArray.push(new Laser(this.x + this.width * 0.9 - 1.5, this.y - 4, 3, 4, "white", "red"));
                    break;
            } 
            this.shootTime = 26;
            this.kills++;
        } else {
            this.shootTime-=deltaTime*100;
        }
        if(this.kills >= 120) this.markedForDeletion = true;
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "silver";
        ctx.fillRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);
    }
    updateCoordinates(){
        super.updateCoordinates();

    }
}

class Input{
    constructor(){
        this.keys = [];
        window.addEventListener("keydown", (e) => {this.updateKeys(e)});
        window.addEventListener("keyup", (e) => {this.updateKeys(e)});
    }
    updateKeys(e){
        if(this.keys.includes(e.code) && (e.code == inputMap.left || e.code == inputMap.right || e.code == inputMap.up || e.code == inputMap.down)) this.keys.splice(this.keys[e.code], 1); 
        if(e.type == "keyup") {
            if(e.code == inputMap.fire) inputMap.hasFired = true;
            this.keys.splice(this.keys[e.code], 1);
        }
        else if (e.type == "keydown") {
            if(e.code == inputMap.fire) inputMap.hasFired = false;
            if(this.keys.includes(e.code)) return;
            this.keys.push(e.code)
        }
    }
}

class Enemy{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = randomVec4();
        this.speed  = Math.floor(Math.random() * 3) + 3;
        this.markedForDeletion = true;
    }
    update(){
        this.y += this.speed;
        if(this.y > GAME_HEIGHT + this.height) this.markedForDeletion = true, ui.health-=5;
        if(this.markedForDeletion) {
            this.x = Math.max(0, Math.floor(Math.random() * GAME_WIDTH) - 64)
            this.y = -20;
            this.width = 64;
            this.height = 64;
            this.color = randomVec4();
            this.speed  = Math.floor(Math.random() * 3) + 3;
        }
        if(this.color.a < 0.4) this.color.a = 0.4;
    }
    draw(ctx){
        ctx.fillStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z}, ${this.color.a})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = `tomato`;
        ctx.fillRect(this.x, this.y + (this.height * 0.8), this.width, this.height - (this.height * 0.8));
    }
}

class Enemies{
    constructor(enemy){
        this.enemies = enemy[0];
        this.timeForNextEnemy = 80;
        this.cTime = 0;
    }
    update(update){
        if(this.cTime < this.timeForNextEnemy){
            this.cTime++;
        } else {
            this.pickAEnemy()
            if(this.timeForNextEnemy < 40) {
                this.pickAEnemy()
            }
            this.timeForNextEnemy>8? this.timeForNextEnemy-=0.4:null;
            this.cTime = 0;
        }
        this.enemies.sort((a, b) => a.speed > b.speed)
        this.enemies.forEach((enemy) => {
            enemy.markedForDeletion? null : enemy.update();
        })
    }
    draw(context){
        this.enemies.forEach(enemy => enemy.markedForDeletion? null : enemy.draw(context));
    }
    pickAEnemy(){
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].markedForDeletion) {
                this.enemies[i].markedForDeletion = false;
                break;
            }
        }
    }
}

class Laser{
    constructor(x, y, width, height, color1, color2){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.markedForDeletion = false;
        this.color1 = color1;
        this.color2 = color2;
        this.moveUp = 6;
    }
    update(){
        if(this.y < 0) this.markedForDeletion = true;
        this.y-=this.moveUp;
        enemies.enemies.forEach(enemy => {
            if(enemy.markedForDeletion) return;
                if(collision(enemy, this)){
                    hit.play()
                    this.markedForDeletion = true;
                    enemy.markedForDeletion = true;
                    enemy.update()
                    ui.score += 20;
                    console.log(ui.score)
                    if((ui.score % nextLevel) == 0) {
                        currentLevel++;
                        if(currentLevel % laserMax == 0) {
                            laserArray.push(new BigLaser(0, GAME_HEIGHT, GAME_WIDTH, 14, "white", "red"));
                            laserMax*=2;
                        }
                        applyLevel(currentLevel);
                        if(nextLevel < 2000) nextLevel += 200;
                        powerup.play()
                    }
                }
            })
        }
    draw(ctx){
        ctx.fillStyle = this.color1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color2;
        ctx.fillRect(this.x, this.y - 4, this.width, this.height - 4);
    }
}

class BigLaser extends Laser{
    constructor(x, y, width, height, color1, color2){
        super(x, y, width, height, color1, color2);
        this.moveUp = 1;
        this.health = 50;
    }
    update(){
        if(this.y < 0) this.markedForDeletion = true;
        this.y-=this.moveUp;
        enemies.enemies.forEach(enemy => {
            if(enemy.markedForDeletion) return;
                if(collision(enemy, this)){
                    hit.play()
                    enemy.markedForDeletion = true;
                    this.health--;
                    if(this.health == 0) this.markedForDeletion = true;
                    enemy.update()
                    ui.score += 20;
                    if((ui.score % nextLevel) == 0) {
                        currentLevel++;
                        let level = currentLevel;
                        if(currentLevel % laserMax == 0) {
                            laserArray.push(new BigLaser(0, GAME_HEIGHT, GAME_WIDTH, 14, "white", "red"));
                            laserMax *= 2;
                        }
                        applyLevel(level);
                        if(nextLevel < 2000) nextLevel += 200;
                        powerup.play()
                    }
                }
        })
    }
    draw(ctx){
        ctx.fillStyle = this.color1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color2;
        ctx.fillRect(this.x, this.y + 4, this.width, this.height - 8);
    }
}

class UI{
    constructor(score, bullet, health){
        this.score = score;
        this.bullet = Number(bullet);
        this.bazooka = 0;
        this.health = health;
        this.bulletTimer = 200;
        this.bulletTime = 0;
    }
    update(){
        if(this.health < 0) gameOver();
        this.bullet = this.bullet - bulletUsed;
        bulletUsed = 0;
        this.bazooka+=0.1;
        if(this.bazooka >= 100){
            this.bazooka = 0;
            this.health+=50;
            if(this.health > 100) this.health = 100; 
            this.bullet = 30;
        }
        if(this.bulletTime >= this.bulletTimer) {
            this.updateBullet();
            this.bulletTimer = Math.floor(Math.random() * (100 - 40) + 40);
            this.bulletTime = 0;
        } else {
            this.bulletTime++;
        }
    }
    draw(ctx){
        ctx.fillStyle = "red";
        ctx.fillRect(20, 20, GAME_WIDTH * 0.6, 40);
        ctx.fillStyle = "orange";
        ctx.fillRect(20, 20, (GAME_WIDTH * 0.6) * (this.health / 100), 40);
        ctx.fillStyle = "white";
        ctx.fillRect(25, 160, GAME_WIDTH * 0.6, 10);
        ctx.fillStyle = "black";
        ctx.fillRect(25, 160, (GAME_WIDTH * 0.6) * (this.bazooka / 100), 10);
        ctx.fillStyle = 'white'
        ctx.font = "30px Comic Sans MS"
        ctx.fillText("HEALTH: " + this.health, 28, 48, GAME_WIDTH * 0.4);
        ctx.fillText("SCORE: " + this.score, 28, 48 + 50, GAME_WIDTH * 0.4);
        ctx.fillStyle = 'gray'
        ctx.fillText("HEALTH: " + this.health, 28 + 2, 48 + 2, GAME_WIDTH * 0.4);
        ctx.fillText("SCORE: " + this.score, 28 + 2, 48 + 52, GAME_WIDTH * 0.4);
        for(let i = 2; i < this.bullet + 2; i++){
            ctx.fillRect(i * 10 + 10, 120, 6, 20);
        }
    }
    updateBullet(){
        if(this.bullet < 30){
            this.bullet = Math.ceil(this.bullet + 0.01)
        }
    }
}


let player = new Player(GAME_WIDTH * 0.5 - 32, GAME_HEIGHT * 0.5 - 32, 64, 64, 10);
let miniPlayers = [new MiniPlayer(GAME_WIDTH * 0.5 - 32, GAME_HEIGHT * 0.5 - 32, 64, 64, 10)];
let input = new Input();
let ui = new UI(0, 30, 100)

let enemiesArray = [];
let enemiesAlive = [];

for(let i = 0; i < 50; i++){
    enemiesArray.push(new Enemy(Math.max(0, Math.floor(Math.random() * GAME_WIDTH) - 64), -Math.floor(Math.random() * 200), 64, 64));
}

let enemies = new Enemies([
    enemiesArray
])

let lastTime = 0;
let accumulator = 0;
let colorStamp = 0.3;

function animate() {
    const pattern = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    pattern.addColorStop(colorStamp, "skyblue");
    pattern.addColorStop(colorStamp + 0.2, "blue");
    context.fillStyle = pattern;
    context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    accumulator += deltaTime;

    while (accumulator >= 1 / idealFrameRate) {
        update(deltaTime); // Update game logic here
        accumulator -= 1 / idealFrameRate;
    }

    render(deltaTime); // Render game state here

    lastTime = now;
    console.log(laserMax)
    requestAnimationFrame(animate);
}

applyLevel(1)
const idealFrameRate = 60;

window.onload = animate;

function update(deltaTime){
    enemies.update();
    player.update();
    enemiesAlive = enemies.enemies.filter(enemy => !enemy.markedForDeletion)
    laserArray.forEach(laser => laser.update())
    laserArray = laserArray.filter(laser => !laser.markedForDeletion)
    ui.update()
    miniPlayers = miniPlayers.filter((miniPlayer) => !miniPlayer.markedForDeletion)
    miniPlayers.forEach(miniPlayer => miniPlayer.update(deltaTime));
    if(colorStamp >= 0.6) colorStamp = 0;
}

function render(deltaTime){
    laserArray.forEach(laser=>laser.draw(context))
    ui.draw(context);
    enemies.draw(context);
    player.draw(context);
    miniPlayers.forEach(miniPlayer => miniPlayer.draw(context, deltaTime));
}

function randomVec4(){
    let [x, y, z, a] = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.random() * 1];

    /* Return the colors as an objet. */
    return {
        x, y, z, a
    };
}

function collision(a, b){
    return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height
}

function gameOver(){
    if(Number(localStorage.getItem("smanoHighscore")) < ui.score) localStorage.setItem("smanoHighscore", ui.score);

    player = new Player(GAME_WIDTH * 0.5 - 32, GAME_HEIGHT * 0.5 - 32, 64, 64, 10);
    input = new Input();
    ui = new UI(0, 20, 100)

    enemiesArray = [];
    enemiesAlive = [];
    currentLevel = 1;
    laserArray = [];
    bulletUsed = 0;
    nextLevel = 200;
    applyLevel(currentLevel);
    miniPlayers = [new MiniPlayer(GAME_WIDTH * 0.5 - 32, GAME_HEIGHT * 0.5 - 32, 64, 64, 10)];

    for(let i = 0; i < 100; i++){
        enemiesArray.push(new Enemy(Math.max(0, Math.floor(Math.random() * GAME_WIDTH) - 64), -Math.floor(Math.random() * 200), 64, 64));
    }
    laserMax = 4;

    enemies = new Enemies([
        enemiesArray
    ])
}