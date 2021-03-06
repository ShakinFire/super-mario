import Trait from '../trait.js';
import Stomper from '../traits/stomper.js';

export const COIN_LIFE_THRESHHOLD = 100;

export default class Player extends Trait {
    constructor() {
        super();
        this.name = 'UNNAMED';
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100;
        });
    }

    addCoins(count) {
        this.coins += count;
        this.queue((entity) => entity.sounds.add('coin'));

        while (this.coins >= COIN_LIFE_THRESHHOLD) {
            this.addLives(1);
            this.coin -= COIN_LIFE_THRESHHOLD;
        }
    }

    addLives(count) {
        this.lives += count;
    }
}