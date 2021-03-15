import { loadJson } from '../loaders.js';
import MusicPlayer from '../music-player.js';

export const loadMusicSheet = async (name) => {
    const musicSheet = await loadJson(`/music/${name}.json`);
    const musicPlayer = new MusicPlayer();
    const musicEntries = Object.entries(musicSheet);

    musicEntries.forEach(([name, track]) => {
        musicPlayer.addTrack(name, track.url);
    });

    return musicPlayer;
};