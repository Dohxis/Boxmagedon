var player;
var jButton;
var cButton;
var bCollected = 1;

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

        game.load.image('player', 'img/player.png');
        
    },

    create: function(){

        // Buttons
        jButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        cButton = game.input.keyboard.createCursorKeys();

        // Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 150;
        
        // Player
        player = game.add.sprite(200, 200, 'player');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 900;
        player.body.maxVelocity.y = 750;
        player.body.setSize(64, 64)

    },

    update: function() {

        player.body.velocity.x = 0;

        // Jump
        if(jButton.isDown && player.body.onFloor()){
            if(bCollected === 1) { player.body.velocity.y = -600; } else { player.body.velocity.y = -350 * bCollected; } 
            console.log(player.body.velocity.y.toString())
        }

        // Movement
        if(cButton.right.isDown){
            player.body.velocity.x = 250 * bCollected;
        } else if(cButton.left.isDown){
            player.body.velocity.x = -250 * bCollected;
        }

        
    }

};

var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

game.state.add('Menu', MenuState);
game.state.add('Game', GameState);
game.state.start('Menu');
