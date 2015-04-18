var player, batteries, enemies, enemy;
var aButton, cButton;
var bCollected = 1;
var map, layer;
var level = 1;
var batteriesOn = 0;
var score = 0;
var enemiesAlive = 0;
var lives = 3;
var scoreText, hearts, battery;

EnemyObj = function(index, game, player){

    var x, y;
    if(game.rnd.integerInRange(0, 1) === 0){ x = 15; } else { x = 905; }
    y = game.world.randomY;

    this.game = game;
    this.hp = 3;
    this.player = player;
    this.enemy = game.add.sprite(x, y, 'player'); // TODO: Change sprite

    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);

    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;

};

EnemyObj.prototype.update = function(){
    this.enemy.rotation = game.physics.arcade.moveToXY(this.enemy, player.body.x, player.body.y, 25);
};

EnemyObj.prototype.damage = function(){
    this.hp--;
    if(this.hp <= 0){
        this.enemy.destroy();
    }
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

var GameState = {

    preload: function() {

        game.load.tilemap('level', 'level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('player', 'img/player.png');
        game.load.image('tilesheet', 'img/tilesheet.png');
        game.load.image('heart', 'img/heart.png');
        game.load.image('battery', 'img/battery.png');
        
    },

    create: function(){

        // FPS
        game.time.desiredFps = 30;

        // Buttons
        aButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        cButton = game.input.keyboard.createCursorKeys();

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
        player = game.add.sprite(200, 200, 'player');
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
        scoreText = game.add.text(game.world.centerX, 25, "0");
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

        },

    update: function() {

        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        // Attack
        if(aButton.isDown){
            // TODO: Attack
        }

        // Movement
        if(cButton.right.isDown){
            player.body.velocity.x = 200 * bCollected;
        }
        else if(cButton.left.isDown){
            player.body.velocity.x = -200 * bCollected;
        }
        else if(cButton.up.isDown){
            player.body.velocity.y = -200 * bCollected;
        }
        else if(cButton.down.isDown){
            player.body.velocity.y = 200 * bCollected;
        }

        // Collision detection
        game.physics.arcade.collide(player, batteries, pickUpBattery, null, this);

        // Place new batteries
        if(batteriesOn < level){
            for(var x = 0; x < level; x++){
                console.log("can: " + level);
                addBattery(x);
            }
        }

        // Create enemies
        if(enemiesAlive < level * 5){
            enemies.push(new EnemyObj(i, game, enemy));
            enemiesAlive++;
        }

        for (var i = 0; i < enemies.length; i++){
            game.physics.arcade.collide(player, enemies[i].enemy, function(){
                if(lives > 0) { hearts[lives - 1].destroy(); lives--; }
            });
            enemies[i].update();
        }

        // Update UI
        scoreText.setText = score;

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
            console.log("You lost");
        }       

    }

};

function pickUpBattery(obj1, obj2){
    if(bCollected < 100){
        bCollected++;
        batteries.remove(obj2);
    }
}

function addBattery(x){
    var battery = batteries.create(game.rnd.integerInRange(32, 868), game.rnd.integerInRange(32, 468), 'player'); // TODO: Change sprite image
    battery.name = 'battery' + x;
    battery.body.immovable = true;
    batteriesOn++;
    console.log("on: " + batteriesOn);
}

var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

game.state.add('Menu', MenuState);
game.state.add('Game', GameState);
game.state.start('Menu');