import { Vec2 } from './math.js';
import BoundingBox from './bounding-box.js';
import EventBuffer from './event-buffer.js';
import Trait from './trait.js';

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
};

export default class Entity {
    constructor() {
        this.canCollide = true;
        this.audio = null;

        this.events = new EventBuffer();

        this.sounds = new Set();
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.offset = new Vec2(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = new Map();
    }

    addTrait(trait) {
        this.traits.set(trait.constructor, trait);
    }

    collides(candidate) {
        this.traits.forEach((trait) => {
            trait.collides(this, candidate);
        });
    }

    obstruct(side, match) {
        this.traits.forEach((trait) => {
            trait.obstruct(this, side, match);
        });
    }

    draw() {
        
    }

    finalize() {
        this.events.emit(Trait.EVENT_TASK, this);

        this.traits.forEach((trait) => {
            trait.finalize(this);
        });

        this.events.clear();
    }

    playSounds(audioBoard, audioContext) {
        this.sounds.forEach((name) => {
            audioBoard.playAudio(name, audioContext);
        });

        this.sounds.clear();
    }

    update(gameContext, level) {
        this.traits.forEach((trait) => {
            trait.update(this, gameContext, level);
            this.playSounds(this.audio, gameContext.audioContext);
        });

        this.lifetime += gameContext.deltaTime;
    }
}