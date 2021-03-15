import Entity from '../entity.js';
import { loadAudioBoard } from '../loaders/audio.js';
import { findPlayers } from '../player.js';
import Emitter from '../traits/emitter.js';

const HOLD_FIRE_THRESHOLD = 30;

export const loadCannon = async (audioContext) => {
    const audio = await loadAudioBoard('cannon', audioContext);

    return createCannonFactory(audio);
};

const createCannonFactory = (audio) => {
    const emitBullet = (cannon, gameContext, level) => {
        let dir = 1;
        for (const player of findPlayers(level.entities)) {
            if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD &&
                player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
                    return;
                }

            if (player.pos.x < cannon.pos.x) {
                dir = -1;
            }
        }

        const bullet = gameContext.entityFactory.bullet();

        bullet.pos.copy(cannon.pos);

        bullet.vel.set(80 * dir, 0);

        // cannon.sounds.add('shoot');
        level.entities.add(bullet);
    }

    return () => {
        const cannon = new Entity();
        cannon.audio = audio;

        const emitter = new Emitter();

        emitter.emitters.push(emitBullet);

        cannon.addTrait(emitter);
        return cannon;
    };
};