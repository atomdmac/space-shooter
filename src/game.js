define([
    'phaser',
    'enemies',
    'weapons',
    'explosions',
], function (Phaser, Enemies, Weapons, Explosions) { 
    'use strict';

    var spaceShip, badGuys, platform, rockets, explosions;

    var ACCEL = 350,
        DRAG  = 400,
        FRICTION = 1,
        BOUNCE = 0.5,
        MAX_VEL = 300;

    var weapons;

    function collidePlatform (body1, body2) {
        body1.x += body2.deltaX;
        body1.y += body2.deltaY;
    }

    function collideEnemiesRockets(body1, body2) {
        body1.kill();
        explosions.explode(body1);
    }

    function Game() {    
        console.log('Making the Game');    
    }
    
    Game.prototype = {
        constructor: Game,

        start: function() {
            console.log('Phaser: ', Phaser);
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { 
                preload: this.preload, 
                create: this.create,
                update: this.update
            });
        },

        preload: function() {
            console.log('Game: preload');
            // this.game.load.image('logo', 'assets/phaser.png');
            this.game.load.image('space-ship', 'assets/space-ship.png');
            this.game.load.image('bad-guy', 'assets/bad-guy.png');
            this.game.load.image('bullet', 'assets/bullet.png');
            this.game.load.image('platform', 'assets/platform.png');
            this.game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64, 25);
        },
        
        create: function() {
            console.log('Game: create');


            // Renderer options
            this.game.renderer.renderSession.roundPixels = true;

            // Physics engine
            this.physics.startSystem(Phaser.Physics.ARCADE);
            
            // Set up spaceship
            spaceShip = this.game.add.sprite(50, 50, 'space-ship');
            spaceShip.anchor.setTo(0.5);
            this.physics.arcade.enable(spaceShip);
            spaceShip.body.drag.x = DRAG;
            spaceShip.body.drag.y = DRAG;
            spaceShip.body.friction.x = FRICTION;
            spaceShip.body.friction.y = FRICTION;
            spaceShip.body.bounce.x = BOUNCE;
            spaceShip.body.bounce.y = BOUNCE;
            spaceShip.body.maxVelocity.x = MAX_VEL;
            spaceShip.body.maxVelocity.y = MAX_VEL;
            spaceShip.body.collideWorldBounds = true;
            spaceShip.body.checkCollision.up = true;
            spaceShip.body.checkCollision.down = true;
            spaceShip.body.checkCollision.left = true;
            spaceShip.body.checkCollision.right = true;

            // Set up bad guy
            /*badGuy = this.game.add.sprite(100, 50, 'bad-guy');
            this.physics.arcade.enable(badGuy);
            badGuy.body.collideWorldBounds = true;
            badGuy.body.checkCollision.up = true;
            badGuy.body.checkCollision.down = true;
            badGuy.body.checkCollision.left = true;
            badGuy.body.checkCollision.right = true;
            badGuy.body.drag.x = DRAG;
            badGuy.body.drag.y = DRAG;
            badGuy.body.friction.x = FRICTION;
            badGuy.body.friction.y = FRICTION;
            badGuy.body.bounce.x = BOUNCE;
            badGuy.body.bounce.y = BOUNCE;*/
            badGuys = new Enemies.BadGuys(this.game);

            // Set up weapons.
            rockets = new Weapons.Rocket(this.game);

            // Set up explosions
            explosions = new Explosions(this.game, 'explosion');

            // Set up platform.
            platform = this.game.add.sprite(200, 200, 'platform');
            platform.sendToBack();
            this.physics.arcade.enable(platform);
            platform.body.immovable = true;
            platform.body.tilePadding.x = -20;
            platform.body.tilePadding.y = -20;
            // platform.body.friction = 100;

            //  Create our tween. This will fade the sprite to alpha 1 over the duration of 2 seconds
            var tween = this.game.add.tween(platform.body)
                .to( { x: 350 }, 4000, Phaser.Easing.Exponential.InOut)
                .to( { y: 350 }, 4000, Phaser.Easing.Exponential.InOut)
                .to( { x: 200 }, 4000, Phaser.Easing.Exponential.InOut)
                .to( { y: 200 }, 4000, Phaser.Easing.Exponential.InOut);
            tween.loop();
            tween.start();
            
            // Set up keyboard controls
            this.cursors = this.input.keyboard.createCursorKeys();
        },

        update: function () {

            // this.physics.arcade.accelerateToObject(badGuy, spaceShip, ACCEL, MAX_VEL, MAX_VEL);

            //spaceShip.body.acceleration.set(0);
            spaceShip.body.acceleration.set(0);

            if (this.cursors.left.isDown)
            {
                spaceShip.body.acceleration.x = -ACCEL;
            }
            else if (this.cursors.right.isDown)
            {
                spaceShip.body.acceleration.x = ACCEL;
            }

            if (this.cursors.up.isDown)
            {
                spaceShip.body.acceleration.y = -ACCEL;
            }
            else if (this.cursors.down.isDown)
            {
                spaceShip.body.acceleration.y = ACCEL;
            }

            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            {
                rockets.fire(spaceShip);
            }

            this.physics.arcade.collide(spaceShip, badGuys);

            this.physics.arcade.overlap(badGuys, rockets, collideEnemiesRockets);

            if(this.physics.arcade.intersects(spaceShip.body, platform.body)) {
                spaceShip.x += platform.deltaX;
                spaceShip.y += platform.deltaY;
            }

            var enemy = true;
            while(enemy) {
                enemy = badGuys.spawn(
                    this.game.camera.width + (100 * Math.random()), 
                    this.game.camera.height * Math.random()
                );
            }

            /*if(this.physics.arcade.intersects(badGuys.body, platform.body)) {
                badGuy.x += platform.deltaX;
                badGuy.y += platform.deltaY;
            }*/
        }
    };
    
    return Game;
});