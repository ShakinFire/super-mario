import Trait from '../trait.js';
import { Vec2 } from '../math.js';
import Killable from './killable.js';

export default class PlayerController extends Trait {
    constructor() {
        super();
        this.player = null;
        this.checkpoint = new Vec2(0, 0);
    }

    setPlayer(entity) {
        this.player = entity;
    }

    update(entity, { deltaTime }, level) {
        if (!level.entities.has(this.player)) {
            this.player.traits.get(Killable).revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
    }
}