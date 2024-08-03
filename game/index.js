const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const GAME_WIDTH = canvas.width = 768;
const GAME_HEIGHT = canvas.height = 1216;
const levelUI = document.getElementById("level");
const startGameUI = document.getElementById("startGame");

const inputMap = {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
    fire: "Space",
    hasFired: false
}

let laserArray = [];
let bulletUsed = 0;

function applyLevel(level){
    levelUI.innerHTML = level;
    startGameUI.style.visibility = "visible";
    setTimeout(clearLevel, 10000);
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
        if(input.keys.includes(inputMap.down) == true) this.y += 8, this.y < GAME_HEIGHT - this.height? colorStamp+=0.001:null;
        else if (input.keys.includes(inputMap.up) == true) this.y -= 8, this.y > GAME_HEIGHT * 0.2? colorStamp -= 0.001:null;
        this.updateCoordinates();
    }
    draw(ctx){
        if(inputMap.hasFired && ui.bullet) {
            laserArray.push(new Laser(this.x + this.width * 0.5 - 2, this.y - 20, 8, 20)), this.timingLaser = 0;
            bulletUsed++;
        };
        inputMap.hasFired = false;
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.collisionX, this.collisionY, this.collisionWidth, this.collisionHeight);
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
        if(this.y > GAME_HEIGHT + this.height) this.markedForDeletion = true, ui.health-=10;
        if(this.markedForDeletion) {
            this.x = Math.max(0, Math.floor(Math.random() * GAME_WIDTH) - 64)
            this.y = -200;
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
    }
}

class Enemies{
    constructor(enemy){
        this.enemies = enemy[0];
        this.timeForNextEnemy = 100;
        this.cTime = 0;
    }
    update(update){
        if(this.cTime < this.timeForNextEnemy){
            this.cTime++;
        } else {
            for(let i = 0; i < this.enemies.length; i++){
                if(this.enemies[i].markedForDeletion) {
                    this.enemies[i].markedForDeletion = false;
                    break;
                }
            }
            this.timeForNextEnemy>20? this.timeForNextEnemy--:null;
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
}

class Laser{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "black";
        this.markedForDeletion = false;
    }
    update(){
        if(this.y < 0) this.markedForDeletion = true;
        this.y-=4;
        enemies.enemies.forEach(enemy => {
            if(enemy.markedForDeletion) return;
                if(collision(enemy, this)){
                    this.markedForDeletion = true;
                    enemy.markedForDeletion = true;
                    enemy.update()
                    ui.score += 20;
                    if(ui.score % 500 == 0) applyLevel((ui.score/500)+ 1)
                }
            })
        }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
            this.health+=40;
            if(this.health > 100) this.health = 100; 
            this.bullet = 20;
        }
        if(this.bulletTime >= this.bulletTimer) {
            this.updateBullet();
            this.bulletTimer = Math.floor(Math.random() * (200 - 50) + 50);
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
        if(this.bullet < 20){
            this.bullet = Math.ceil(this.bullet + 0.01)
        }
    }
}


const player = new Player(GAME_WIDTH * 0.5 - 32, GAME_HEIGHT * 0.5 - 32, 64, 64, 10);
const input = new Input();
const ui = new UI(0, 20, 100)

const enemiesArray = [];
let enemiesAlive = [];

for(let i = 0; i < 20; i++){
    enemiesArray.push(new Enemy(Math.max(0, Math.floor(Math.random() * GAME_WIDTH) - 64), -Math.floor(Math.random() * 200), 64, 64));
}

const enemies = new Enemies([
    enemiesArray
])

let deltaTime = 0;
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
        update(deltaTime, context); // Update game logic here
        accumulator -= 1 / idealFrameRate;
    }

    render(); // Render game state here

    lastTime = now;
    requestAnimationFrame(animate);
}

applyLevel(1)
const idealFrameRate = 60;

window.onload = animate;

function update(){
    enemies.update();
    player.update();
    enemiesAlive = enemies.enemies.filter(enemy => !enemy.markedForDeletion)
    laserArray.forEach(laser => laser.update())
    laserArray = laserArray.filter(laser => !laser.markedForDeletion)
    ui.update()
    if(colorStamp >= 0.6) colorStamp = 0;
}

function render(){
    laserArray.forEach(laser=>laser.draw(context))
    ui.draw(context);
    enemies.draw(context);
    player.draw(context);
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
