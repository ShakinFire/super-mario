import Compositor from './compositor.js';
import EventEmitter from './event-emitter.js';

export default class Scene {
    static EVENT_COMPLETE = Symbol('scene complete');

    constructor() {
        this.events = new EventEmitter();
        this.comp = new Compositor();
    }

    draw(gameContext) {
        this.comp.draw(gameContext.videoContext);
    }

    update(gameContext) {
    }

    pause() {
        
    }
}