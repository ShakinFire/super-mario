import Trait from '../trait.js';

export default class Spawner extends Trait {
    constructor() {
        super();
        this.entities = [];
        this.offsetX = 64;
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.entities.sort((a, b) => a.pos.x < b.pos.x ? -1 : 1);
    }

    update(entity, gameContext, level) {
        const cameraMaxX = level.camera.pos.x + level.camera.size.x + this.offsetX;
        while (this.entities[0]) {
            if (cameraMaxX > this.entities[0].pos.x) {
                level.entities.add(this.entities.shift());
            } else {
                break;
            }
        }

    }
}