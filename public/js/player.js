import Entity from './entity.js';
import PlayerController from './traits/player-controller.js';
import Player from './traits/player.js';

export const createPlayerEnv = (playerEntity) => {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);

    return playerEnv;
};

export const makePlayer = (entity, name) => {
    const player = new Player();
    player.name = name;
    entity.addTrait(player);
};

export function* findPlayers(entities) {
    for(const entity of entities) {
        if (entity.traits.has(Player)) {
            yield entity;
        }
    }
}