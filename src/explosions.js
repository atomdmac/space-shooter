define([
    'phaser'
], function (Phaser) { 
    'use strict';

var Explosions = function (game, key) {

    Phaser.Group.call(this, game, game.world, 'Explosions', false, true, Phaser.Physics.ARCADE);

    var sprite, anim;
    for(var i=0; i<64; i++) {
        sprite = new Phaser.Sprite(game, 0, 0, key);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.exists = false;
        sprite.tracking = false;
        sprite.scaleSpeed = 0;
        sprite.anchor.set(0.5);
        anim = sprite.animations.add('explode');
        anim.onComplete.add(onExplodeComplete, this);
        this.add(sprite);
    }
};

Explosions.prototype = Object.create(Phaser.Group.prototype);
Explosions.prototype.constructor = Explosions;
Explosions.prototype.explode = function (target) {
    var sprite = this.getFirstExists(false);
    sprite.reset(target.x, target.y);
    sprite.play('explode', 20);
};

function onExplodeComplete (sprite, animation) {
    sprite.kill();
}

return Explosions;


});