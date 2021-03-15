import Trait from '../trait.js';

export default class Killable extends Trait {
    constructor() {
        super();
        this.isDead = false;
        this.deadTime = 0;
        this.removeAfter = 2;
    }

    kill() {
        this.queue(() => this.isDead = true);
    }

    revive() {
        this.isDead = false;
        this.deadTime = 0;
    }

    update(entity, { deltaTime }, level) {
        if (this.isDead) {
            this.deadTime += deltaTime;

            if (this.deadTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                });
            }
        }
    }
}