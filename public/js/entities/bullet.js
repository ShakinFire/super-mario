import Entity from '../entity.js';
import Trait from '../trait.js';
import Killable from '../traits/killable.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import Velocity from '../traits/velocity.js';
import Gravity from '../traits/gravity.js';
import Stomper from '../traits/stomper.js';

export const loadBullet = () => {
    return loadSpriteSheet('bullet')
        .then((sprite) => createBulletFactory(sprite));
};

class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.gravity = new Gravity();
    }

    collides(us, them) {
        if (us.traits.get(Killable).isDead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y) {
                us.traits.get(Killable).kill();
                us.vel.set(100, -200);
            } else {
                them.traits.get(Killable).kill();
            }
        }
    }

    update(entity, gameContext, level) {
        if (entity.traits.get(Killable).isDead) {
            this.gravity.update(entity, gameContext, level);
        } 
    }
}

const createBulletFactory = (sprite) => {
    function drawBullet (context) {
        sprite.draw('bullet', context, 0, 0, this.vel.x < 0);
    }

    return () => {
        const bullet = new Entity();
        bullet.size.set(16, 14);

        bullet.addTrait(new Behavior());
        bullet.addTrait(new Velocity());
        bullet.addTrait(new Killable());

        bullet.draw = drawBullet;

        return bullet;
    };
};