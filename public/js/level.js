import TileCollider from './tile-collider.js';
import EntityCollider from './entity-collider.js';
import MusicController from './music-controller.js';
import Camera from './camera.js';
import { findPlayers } from './player.js';
import Scene from './scene.js';

const focusPlayer = (level) => {
    for (const player of findPlayers(level.entities)) {
        level.camera.pos.x = Math.max(0, player.pos.x - 100);
    }
};

class EntityCollection extends Set {
    get(id) {
        for (const entity of this) {
            if (entity.id === id) {
                return entity;
            }
        }
    }
}

export default class Level extends Scene {
    static EVENT_TRIGGER = Symbol('trigger');
    constructor() {
        super();

        this.name = '';
        this.gravity = 1500;
        this.totalTime = 0;

        this.camera = new Camera();
        this.music = new MusicController();
        this.entities = new EntityCollection();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = new TileCollider();
    }

    draw(gameContext) {
        this.comp.draw(gameContext.videoContext, this.camera);
    }

    update(gameContext) {
        this.entities.forEach((entity) => {
            entity.update(gameContext, this);
        });

        this.entities.forEach((entity) => {
            this.entityCollider.check(entity, this);
        });

        this.entities.forEach((entity) => {
            entity.finalize();
        });

        focusPlayer(this);

        this.totalTime += gameContext.deltaTime;
    }

    pause() {
        this.music.pause();
    }
}