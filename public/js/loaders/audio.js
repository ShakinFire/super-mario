import { loadJson } from '../loaders.js';
import AudioBoard from '../audio-board.js';

export const loadAudioBoard = async (name, audioContext) => {
    const loadAudio = createAudioLoader(audioContext);
    const audioSheet = await loadJson(`/sounds/${name}.json`);
    const audioBoard = new AudioBoard();
    const fx = audioSheet.fx;

    const fxEntries = Object.entries(fx);
    const loadedAudios = await Promise.all(
        fxEntries.map(async ([name, audio]) => {
            const url = audio.url;
            const buffer = await loadAudio(url);

            return {
                name,
                buffer,
            };
        }),
    );

    loadedAudios.forEach((audio) => {
        audioBoard.addAudio(audio.name, audio.buffer);
    });

    return audioBoard;
};

export const createAudioLoader = (context) => async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return context.decodeAudioData(arrayBuffer);
};