var MenuState = {

    preload: function() {
        
    },

    create: function(){
        console.log("Menu");
        game.state.start("Game");
    },

    update: function() {
        
    }

};

var GameState = {

    preload: function() {
        
    },

    create: function(){
        console.log("Game");

    },

    update: function() {
        
    }

};

var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

game.state.add('Menu', MenuState);
game.state.add('Game', GameState);
game.state.start('Menu');
