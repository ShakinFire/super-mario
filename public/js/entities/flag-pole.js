import Entity from '../entity.js';
import { loadAudioBoard } from '../loaders/audio.js';
import Pole from '../traits/pole.js';

export const loadFlagPole = async (audioContext) => {
    const audio = await loadAudioBoard('flag-pole', audioContext);
    return createFactory(audio);
};

const createFactory = (audio) => {
    return () => {
        const flagPole = new Entity();
        flagPole.audio = audio;
        flagPole.size.set(8, 144);
        flagPole.offset.set(4, 0);

        flagPole.addTrait(new Pole());
        return flagPole;
    };
};