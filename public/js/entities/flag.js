import Entity from '../entity.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import PoleTraveller from '../traits/pole-traveller.js';

export const loadFlag = async () => {
    const sprite = await loadSpriteSheet('flag');
    return createFactory(sprite);
};

const createFactory = (sprite) => {
    function drawFlag (context) {
        sprite.draw('flag', context, 0, 0, this.vel.x < 0);
    }

    return () => {
        const flag = new Entity();
        flag.size.set(16, 16);
        flag.draw = drawFlag;

        flag.addTrait(new PoleTraveller());
        return flag;
    };
};