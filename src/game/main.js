var player, batteries, enemies, enemy, bullets;
var bCollected = 1;
var map, layer;
var level = 1;
var batteriesOn = 0;
var score = 0;
var enemiesAlive = 0;
var nF = 0, fR = 50;
var lives = 3;
var scoreText, hearts, battery;

EnemyObj = function(index, game, player){

    var x, y;
    x = 15;
    y = game.world.randomY;

    this.game = game;
    this.hp = 3;
    this.player = player;
    this.enemy = game.add.sprite(x, y, 'enemy');

    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.name = index.toString();
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.setSize(32, 32);

};

EnemyObj.prototype.update = function(){
    this.enemy.rotation = game.physics.arcade.moveToXY(this.enemy, player.body.x, player.body.y, 25);
}

EnemyObj.prototype.damage = function(){
    this.hp--;
    if(this.hp <= 0){
        score += 20;
        enemiesAlive--;
        this.enemy.kill();
        return true;
    }
    return false;
};

var MenuState = {

    preload: function() {
        
    },

    create: function(){

        game.state.start("Game");

    },

    update: function() {
        
    }

};

var LostState = {

    preload: function() {
        
    },

    create: function(){

        game.state.start("Game", true, false);

    },

    update: function() {
        
    }

};

var GameState = {

    preload: function() {

        game.load.tilemap('level', 'level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('player', 'img/player.png');
        game.load.image('tilesheet', 'img/tilesheet.png');
        game.load.image('heart', 'img/heart.png');
        game.load.image('battery', 'img/battery.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('enemy', 'img/enemy.png');
        
    },

    create: function(){

        // FPS
        game.time.desiredFps = 30;

        // Map
        map = game.add.tilemap('level');
        map.addTilesetImage('tilesheet');
        map.setCollisionByExclusion([ 1 ]);
        layer = map.createLayer('Layer');
        //layer.debug = true;
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
        for(var x = 0; x < level * 5; x++){
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
            nF = game.time.now + fR;
            var bullet = bullets.getFirstExists(false);
            bullet.reset(player.body.x + 16, player.body.y + 16);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
            console.log(enemiesAlive);
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
            var nw = enemies.length + (level * 5);
            for(var x = enemies.length; x < nw; x++){
                enemies.push(new EnemyObj(x, game, enemy));
                enemiesAlive++;
            }
            var no = 0;
            if(level >= 3){ no = 3; } else {no = level; }
            for(var x = 0; x < no; x++){
                addBattery();
            }
            level++;
        }

        for (var i = 0; i < enemies.length; i++){
            game.physics.arcade.collide(player, enemies[i].enemy, function(){
                if(lives > 0) { hearts[lives - 1].destroy(); lives--; }
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
        }

        if(bCollected === 2){
            battery[2].visible = true;
            battery[1].visible = true;
            battery[0].visible = false;
        }

        if(bCollected === 3){
            battery[2].visible = true;
            battery[1].visible = true;
            battery[0].visible = true;
        }

        if(bCollected === 0){
            battery[2].visible = false;
            battery[1].visible = false;
            battery[0].visible = false;
        }


        // Check if lost
        if(lives === 0){
            lives = 3;
            game.state.start("Lost");
        }

        // Updating fire rate
        fR = 500 / bCollected;       

    }

};

function pickUpBattery(obj1, obj2){
    if(bCollected < 100){
        bCollected++;
        //batteriesOn--;
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