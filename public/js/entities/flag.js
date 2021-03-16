import Entity from '../entity.js';
import Trait from '../trait.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import Velocity from '../traits/velocity.js';

export const loadFlag = () => {
    return loadSpriteSheet('flag')
        .then((sprite) => createFlagFactory(sprite));
};

class Behavior extends Trait {
    constructor() {
        super();
        this.shouldMove = false;

        this.listen('asd', () => {
            this.shouldMove = true;
        }, 1);
    }

    collides(us, them) {
    }

    update(entity, gameContext, level) {
        if (this.shouldMove) {
            console.log(entity);
        }
    }
}

const createFlagFactory = (sprite) => {
    function drawFlag (context) {
        sprite.draw('flag', context, 0, 0, this.vel.x < 0);
    }

    return () => {
        const flag = new Entity();
        flag.size.set(16, 16);

        flag.addTrait(new Behavior());
        flag.addTrait(new Velocity());

        flag.draw = drawFlag;

        return flag;
    };
};