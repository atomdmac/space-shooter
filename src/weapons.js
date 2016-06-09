define([
    'phaser'
], function (Phaser) { 
    'use strict';

var Bullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);

    this.angle = angle;

};

var Weapons = {};

Weapons.Rocket = function (game) {

    Phaser.Group.call(this, game, game.world, 'Rocket', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.bulletAcceleration = 300;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet'), true);
    }

    return this;

};

Weapons.Rocket.prototype = Object.create(Phaser.Group.prototype);

Weapons.Rocket.prototype.constructor = Weapons.Rocket;

Weapons.Rocket.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x;
    var y = source.y - (source.height / 2);

    var rocket = this.getFirstExists(false);
    	rocket.fire(x, y, 0, -this.bulletSpeed, 0, 0);
        rocket.body.velocity.y = -this.bulletSpeed * 0.75;
    	rocket.body.acceleration.y = -this.bulletAcceleration;
    	rocket.body.maxVelocity.y = this.bulletSpeed;

    this.nextFire = this.game.time.time + this.fireRate;

};

return Weapons;

});