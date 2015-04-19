var player, batteries, enemies, enemy, bullets, scoreText, hearts, battery;
var bCollected = 1, batteriesOn = 0;;
var map, layer, level = 1;
var score = 0, lives = 3;
var enemiesAlive = 0;
var nF = 0, fR = 50;
var killed = 0, canKill = 10;

EnemyObj = function(index, game, enemy){

    var x, y, randM;
    x = 15;
    y = game.world.randomY;
    this.randM = game.rnd.integerInRange(-50, 50);
    this.game = game;
    this.hp = 6;
    this.enemy = game.add.sprite(x, y, 'enemy');
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.name = index.toString();
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.setSize(32, 32);

};

EnemyObj.prototype.update = function(){
    this.enemy.rotation = game.physics.arcade.moveToXY(this.enemy, player.body.x + this.randM, player.body.y + this.randM, 25 * level);
}

EnemyObj.prototype.damage = function(){
    if(bCollected == 3){
        this.hp -= 3;
        killed++;
    } if(bCollected == 2){
        this.hp -= 2;
    } else {
        this.hp--;
    }

    if(this.hp <= 0){
        if(bCollected == 3) { score += 50; } else { score += 20; }
        enemiesAlive--;
        explosion.play();
        this.enemy.kill();
        return true;
    }
    return false;
};

var text = [
    " ",
    "Welcome...",
    "This game was created for Ludum Dare 32",
    "To start just press [SPACEBAR]",
    "Good luck!"
];

var index = 0, line = '', nwText;
var spaceBar, music, explosion, powerup, shoot;

var MenuState = {

    preload: function() {
        
        game.load.tilemap('level', 'level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('player', 'img/player.png');
        game.load.image('tilesheet', 'img/tilesheet.png');
        game.load.image('heart', 'img/heart.png');
        game.load.image('battery', 'img/battery.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('enemy', 'img/enemy.png');
        game.load.audio('music', 'sounds/music.mp3');
        game.load.audio('explosion', 'sounds/explosion.wav');
        game.load.audio('powerup', 'sounds/pickup.wav');
        game.load.audio('shoot', 'sounds/shoot.wav');

    },

    create: function(){

        music = game.add.audio('music');
        music.volume = 0.01;
        music.loop = true;
        music.play();

        map = game.add.tilemap('level');
        map.addTilesetImage('tilesheet');
        map.setCollisionByExclusion([ 1 ]);
        layer = map.createLayer('Layer');
        layer.resizeWorld();

        var nmText;

        nmText = game.add.text(game.world.centerX - 25, game.world.centerY - 45, "Boxmagedon");
        nmText.anchor.set(0.5);
        nmText.align = 'center';
        nmText.font = 'Arial Black';
        nmText.fontSize = 105;
        nmText.fontWeight = 'bold';
        nmText.fill = '#499231';
        nmText.fixedToCamera = true;
        nmText.alpha = 0;
        game.add.tween(nmText).to( { alpha: 1 }, 2000, "Linear", true);

        nwText = game.add.text(game.world.centerX - 25, game.world.centerY + 30, '');
        nwText.anchor.set(0.5);
        nwText.align = 'center';
        nwText.font = 'Arial Black';
        nwText.fontSize = 25;
        nwText.fontWeight = 'bold';
        nwText.fill = '#499231';
        nwText.fixedToCamera = true;

        nextL();
        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update: function() {
        if (spaceBar.isDown){
            game.state.start("Game");
        }
    }

};

function playerTween(tweenValue) {
    var tw;
    tw = game.add.tween(player.scale);
    tw.to({x: tweenValue, y: tweenValue}, 1000, Phaser.Easing.Linear.None);
    tw.start();
}

function nextL(){
    if(index == 4) index = 0;
    index++;
    if (index < text.length){
        line = '';
        game.time.events.repeat(80, text[index].length + 1, updateL, this);
    }
}

function updateL() {
    if (line.length < text[index].length){
        line = text[index].substr(0, line.length + 1);
        nwText.setText(line);
    } else {
        game.time.events.add(Phaser.Timer.SECOND * 1, nextL, this);
    }
}


var LostState = {

    create: function(){

        map = game.add.tilemap('level');
        map.addTilesetImage('tilesheet');
        map.setCollisionByExclusion([ 1 ]);
        layer = map.createLayer('Layer');
        layer.resizeWorld();

        var scText, lsText, rsText;

        scText = game.add.text(game.world.centerX, game.world.centerY - 25, "Your score is " + score.toString());
        scText.anchor.set(0.5);
        scText.align = 'center';
        scText.font = 'Arial Black';
        scText.fontSize = 35;
        scText.fontWeight = 'bold';
        scText.fill = '#499231';
        scText.fixedToCamera = true;

        lsText = game.add.text(game.world.centerX, game.world.centerY - 75, "You lost!");
        lsText.anchor.set(0.5);
        lsText.align = 'center';
        lsText.font = 'Arial Black';
        lsText.fontSize = 75;
        lsText.fontWeight = 'bold';
        lsText.fill = '#499231';
        lsText.fixedToCamera = true;

        rsText = game.add.text(game.world.centerX, game.world.centerY + 10, "Restart this page and try again :)");
        rsText.anchor.set(0.5);
        rsText.align = 'center';
        rsText.font = 'Arial Black';
        rsText.fontSize = 20;
        rsText.fontWeight = 'bold';
        rsText.fill = '#499231';
        rsText.fixedToCamera = true;

    }

};

var GameState = {

    create: function(){

        //Music
        explosion = game.add.audio('explosion', 0.05, false);
        powerup = game.add.audio('powerup', 0.09, false);
        shoot = game.add.audio('shoot', 0.005, false);

        // FPS
        game.time.desiredFps = 30;

        // Map
        map = game.add.tilemap('level');
        map.addTilesetImage('tilesheet');
        map.setCollisionByExclusion([ 1 ]);
        layer = map.createLayer('Layer');
        layer.resizeWorld();

        // Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Player
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.maxVelocity.y = 750;
        player.body.setSize(32, 32);
        game.camera.follow(player);

        // Batteries
        batteries = game.add.group();
        batteries.enableBody = true;
        batteries.physicsBodyType = Phaser.Physics.ARCADE;

        // Enemies
        enemies = [];
        for(var x = 0; x < 2; x++){
            enemies.push(new EnemyObj(x, game, enemy));
            enemiesAlive++;
        }

        // UI
        scoreText = game.add.text(game.world.centerX, 25, score.toString());
        scoreText.anchor.set(0.5);
        scoreText.align = 'center';
        scoreText.font = 'Arial Black';
        scoreText.fontSize = 50;
        scoreText.fontWeight = 'bold';
        scoreText.fill = '#499231';
        scoreText.fixedToCamera = true;

        hearts = [];

        hearts.push(game.add.sprite(5, 5, 'heart'));
        hearts.push(game.add.sprite(45, 5, 'heart'));
        hearts.push(game.add.sprite(85, 5, 'heart'));
        hearts[0].fixedToCamera = true;
        hearts[1].fixedToCamera = true;
        hearts[2].fixedToCamera = true;

        battery = [];

        battery.push(game.add.sprite(815, 5, 'battery'));
        battery.push(game.add.sprite(840, 5, 'battery'));
        battery.push(game.add.sprite(865, 5, 'battery'));
        battery[0].fixedToCamera = true;
        battery[1].fixedToCamera = true;
        battery[2].fixedToCamera = true;

        // My bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(100, 'bullet', 0, false);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        },

    update: function() {

        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        // Attack
        if(game.input.activePointer.isDown && nF < game.time.now && bullets.countDead() > 0){
            shoot.play();
            nF = game.time.now + fR;
            var bullet = bullets.getFirstExists(false);
            bullet.reset(player.body.x + 16, player.body.y + 16);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
        }

        // Movement
        if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
            player.body.velocity.x = 200 * bCollected;
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
            player.body.velocity.x = -200 * bCollected;
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
            player.body.velocity.y = -200 * bCollected;
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
            player.body.velocity.y = 200 * bCollected;
        }

        // Collision detection
        game.physics.arcade.collide(player, batteries, pickUpBattery, null, this);

        // Create enemies
        if(enemiesAlive <= 0){
            var nw = enemies.length + (level * 2);
            for(var x = enemies.length; x < nw; x++){
                enemies.push(new EnemyObj(x, game, enemy));
                enemiesAlive++;
            }
            var no = 0;
            if(level >= 3){ no = 3 - bCollected; } else {no = level - bCollected; }
            for(var x = 0; x < no; x++){
                addBattery();
            }
            level++;
        }

        for (var i = 0; i < enemies.length; i++){
            game.physics.arcade.collide(player, enemies[i].enemy, function(){
                if(lives > 0) { hearts[lives - 1].destroy(); lives--; player.body.x = game.world.centerX; player.body.y = game.world.centerY; }
            });
            game.physics.arcade.collide(bullets, enemies[i].enemy, hitEnemy, null, this);
            enemies[i].update();
        }

        // Update UI
        scoreText.setText(score.toString());

        if(bCollected === 1){
            battery[2].visible = true;
            battery[1].visible = false;
            battery[0].visible = false;
            playerTween(1);
        }

        if(bCollected === 2){
            battery[2].visible = true;
            battery[1].visible = true;
            battery[0].visible = false;
            playerTween(1.5);
        }

        if(bCollected === 3){
            battery[2].visible = true;
            battery[1].visible = true;
            battery[0].visible = true;
            playerTween(2);
        }

        if(bCollected === 0){
            battery[2].visible = false;
            battery[1].visible = false;
            battery[0].visible = false;
            playerTween(1);
        }


        // Check if lost
        if(lives === 0){
            lives = 3;
            game.state.start("Lost");
        }

        // Updating fire rate
        fR = 500 / bCollected;

        // Decrease batteries
        if(killed == canKill){
            bCollected = 2;
            canKill *= 2;
        }        

    }

};

function pickUpBattery(obj1, obj2){
    if(bCollected < 3){
        bCollected++;
        powerup.play();
        batteries.remove(obj2);
    }
}

function addBattery(){
    var battery = batteries.create(game.rnd.integerInRange(32, 868), game.rnd.integerInRange(32, 468), 'battery');
    battery.body.immovable = true;
}

function hitEnemy(enemy, bullet){
    bullet.kill();
    enemies[enemy.name].damage();
}

var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

game.state.add('Menu', MenuState);
game.state.add('Game', GameState);
game.state.add('Lost', LostState);
game.state.start('Menu');