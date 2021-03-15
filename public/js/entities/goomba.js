import Entity from '../entity.js';
import Trait from '../trait.js';
import PendulumMove from '../traits/pendulum-move.js';
import Killable from '../traits/killable.js';
import Solid from '../traits/solid.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import Physics from '../traits/physics.js';
import Stomper from '../traits/stomper.js';

export const loadGoomba = () => {
    return loadSpriteSheet('goomba')
        .then((sprite) => createGoombaFactory(sprite));
};

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.traits.get(Killable).isDead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y) {
                us.traits.get(Killable).kill();
                us.traits.get(PendulumMove).speed = 0;
            } else {
                them.traits.get(Killable).kill();
            }
        }
    }
}

const createGoombaFactory = (sprite) => {
    const walkAnim = sprite.animations.get('walk');

    const routeAnim = (goomba) => {
        if (goomba.traits.get(Killable).isDead) {
            return 'flat';
        }

        return walkAnim(goomba.lifetime);
    };

    function drawGoomba (context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return () => {
        const goomba = new Entity();
        goomba.size.set(16, 16);

        goomba.addTrait(new Physics());
        goomba.addTrait(new Solid());
        goomba.addTrait(new PendulumMove());
        goomba.addTrait(new Behavior());
        goomba.addTrait(new Killable());

        goomba.draw = drawGoomba;

        return goomba;
    };
};