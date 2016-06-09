define([
    'phaser'
], function (Phaser) { 
    'use strict';

var BadGuy = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    // this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

BadGuy.prototype = Object.create(Phaser.Sprite.prototype);
BadGuy.prototype.constructor = BadGuy;
BadGuy.prototype.spawn = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1 + (1*Math.random()));

    this.angle = angle;

    this.body.maxVelocity.y = 100 + (50 * Math.random());
    this.body.acceleration.y = 100 + (50 * Math.random());
};

var Enemies = {};

Enemies.BadGuys = function (game) {

    Phaser.Group.call(this, game, game.world, 'BadGuys', false, true, Phaser.Physics.ARCADE);

	for(var i=0; i<5; i++) {
		this.add(new BadGuy(this.game, 'bad-guy'), true);
	}
};

Enemies.BadGuys.prototype = Object.create(Phaser.Group.prototype);
Enemies.BadGuys.prototype.constructor = Enemies.BadGuys;
Enemies.BadGuys.prototype.spawn = function (x, y) {
	var badGuy = this.getFirstExists(false);
        if(badGuy) badGuy.spawn(x, y, 0, 0, 0, 0);
    return badGuy;
};

return Enemies;


});