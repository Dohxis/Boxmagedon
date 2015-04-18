var player;
var aButton;
var cButton;
var bCollected = 1;
var battery;
var map;
var layer;

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
        player.body.setSize(32, 32)
        game.camera.follow(player);

        // Batteries
        battery = game.add.sprite(400, 300, 'player'); // TODO: Change sprite image
        game.physics.enable(battery, Phaser.Physics.ARCADE);
        battery.body.immovable = true;

    },

    update: function() {

        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        // Jump
        if(aButton.isDown){
            // TODO: Attack
        }

        // Movement
        if(cButton.right.isDown){
            player.body.velocity.x = 250 * bCollected;
        }
        else if(cButton.left.isDown){
            player.body.velocity.x = -250 * bCollected;
        }
        else if(cButton.up.isDown){
            player.body.velocity.y = -250 * bCollected;
        }
        else if(cButton.down.isDown){
            player.body.velocity.y = 250 * bCollected;
        }

        // Pick up battery
        game.physics.arcade.collide(player, battery, pickUpBattery, null, this);

    }

};

function pickUpBattery(obj1, obj2){
    if(bCollected < 3){
        bCollected++;
        obj2.destroy();
    }
}

var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

game.state.add('Menu', MenuState);
game.state.add('Game', GameState);
game.state.start('Menu');
