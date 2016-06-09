define([
    'phaser',
    'enemies',
    'weapons',
    'explosions',
], function (Phaser, Enemies, Weapons, Explosions) { 
    'use strict';

    // Game objects
    var game, spaceShip, badGuys, platform, rockets, explosions, pad1;
    // Settings
    var ACCEL = 1000,
        DRAG  = 1000,
        FRICTION = 1,
        BOUNCE = 0.5,
        MAX_VEL = 400;

    // Called when rockets collide with enemies.
    function collideEnemiesRockets(body1, body2) {
        body1.kill();
        explosions.explode(body1);
    }

    function forEachEnemyAlive (enemy) {
        if(enemy.y > game.camera.height + enemy.height) {
            enemy.kill();
        }
    }

    function forEachEnemyDead (enemy) {
        var x = game.camera.width * Math.random() - enemy.width / 2,
            y = -enemy.height - (enemy.height * Math.random());

        if(x < enemy.width / 2) x = enemy.width / 2;
        if(x > game.camera.width - (enemy.width / 2)) x = game.camera.width - (enemy.width / 2);
        
        enemy.spawn(x, y);
    }

    function Game() {    
        console.log('Making the Game');    
    }
    
    Game.prototype = {
        constructor: Game,

        start: function() {
            console.log('Phaser: ', Phaser);
            game = this.game = new Phaser.Game(600, 800, Phaser.AUTO, '', { 
                preload: this.preload, 
                create: this.create,
                update: this.update
            });
        },

        preload: function() {
            console.log('Game: preload');

            // Load sprites/sheets
            this.game.load.image('space-ship', 'assets/space-ship.png');
            this.game.load.image('bad-guy', 'assets/bad-guy.png');
            this.game.load.image('bullet', 'assets/bullet.png');
            this.game.load.image('platform', 'assets/platform.png');
            this.game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64, 25);
        },
        
        create: function() {
            console.log('Game: create');

            var self = this;

            // Renderer options
            this.game.renderer.renderSession.roundPixels = true;

            // Physics engine
            this.physics.startSystem(Phaser.Physics.ARCADE);
            
            // Set up spaceship
            spaceShip = this.game.add.sprite(this.game.camera.width / 2, this.game.camera.height - 100, 'space-ship');
            spaceShip.anchor.setTo(0.5);
            
            // Spaceship physics
            this.physics.arcade.enable(spaceShip);
            spaceShip.body.drag.set(DRAG);
            spaceShip.body.friction.set(FRICTION);
            spaceShip.body.bounce.set(BOUNCE);
            spaceShip.body.maxVelocity.set(MAX_VEL);
            spaceShip.body.collideWorldBounds = true;

            // Set up bad guys
            badGuys = new Enemies.BadGuys(this.game);
            badGuys.forEach(function (enemy) {
                var newX = self.game.camera.width * Math.random(),
                    newY = -enemy.height;
                enemy.spawn(newX, newY);
            });

            // Set up Rockets
            rockets = new Weapons.Rocket(this.game);

            // Set up explosions
            explosions = new Explosions(this.game, 'explosion');
            
            // Set up keyboard controls
            this.cursors = this.input.keyboard.createCursorKeys();

            this.game.input.gamepad.start();
            pad1 = this.game.input.gamepad.pad1;
        },

        update: function () {

            // Clear acceleration.  We'll apply it again if the user is still
            // providing movement input.
            spaceShip.body.acceleration.set(0);

            // Apply acceleration based on user input.
            if (this.cursors.left.isDown ||
                pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
                pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
            {
                spaceShip.body.acceleration.x = -ACCEL;
            }
            else if (this.cursors.right.isDown ||
                pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
                pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
            {
                spaceShip.body.acceleration.x = ACCEL;
            }

            if (this.cursors.up.isDown ||
               pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) ||
               pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
            {
                spaceShip.body.acceleration.y = -ACCEL;
            }
            else if (this.cursors.down.isDown ||
               pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) ||
               pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
            {
                spaceShip.body.acceleration.y = ACCEL;
            }

            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || 
                pad1.isDown(Phaser.Gamepad.XBOX360_A))
            {
                rockets.fire(spaceShip);
            }

            // Collide player ship and bad guys.
            this.physics.arcade.collide(spaceShip, badGuys);
            this.physics.arcade.overlap(badGuys, rockets, collideEnemiesRockets);

            // Continue to spawn bad guys as they are killed/escape off the screen.
            badGuys.forEachExists(forEachEnemyAlive);
            badGuys.forEachDead(forEachEnemyDead);
        }
    };
    
    return Game;
});