import { loadMario } from './entities/mario.js';
import { loadKoopa } from './entities/koopa.js';
import { loadGoomba } from './entities/goomba.js';
import { loadBullet } from './entities/bullet.js';
import { loadCannon } from './entities/cannon.js';
import { loadFlagPole } from './entities/flag-pole.js';
import { loadFlag } from './entities/flag.js';

export const loadEntities = (audioContext) => {
    const entityFactories = {};

    const addAs = (name) => (factory) => entityFactories[name] = factory;

    return Promise.all([
        loadMario(audioContext).then(addAs('mario')),
        loadGoomba(audioContext).then(addAs('goomba')),
        loadKoopa(audioContext).then(addAs('koopa')),
        loadBullet(audioContext).then(addAs('bullet')),
        loadCannon(audioContext).then(addAs('cannon')),
        loadFlagPole(audioContext).then(addAs('flag-pole')),
        loadFlag(audioContext).then(addAs('flag')),
    ])
        .then(() => entityFactories);
};