import { findPlayers } from '../player.js';
import Player from '../traits/player.js';
import LevelTimer from '../traits/level-timer.js';

const getPlayerTrait = (entities) => {
    for (const entity of findPlayers(entities)) {
        return entity.traits.get(Player);
    }
};

const getTimerTrait = (entities) => {
    for (const entity of entities) {
        if (entity.traits.has(LevelTimer)) {
            return entity.traits.get(LevelTimer);
        }
    }
};

export const createDashboardLayer = (font, level) => {
    const LINE1 = font.size;
    const LINE2 = font.size * 2;
    const timerTrait = getTimerTrait(level.entities);

    return (context) => {
        const playerTrait = getPlayerTrait(level.entities);

        if (playerTrait) {
            font.print(playerTrait.name, context, 16, LINE1);
            font.print(playerTrait.score.toString().padStart(6, '0'), context, 16, LINE2);
    
            font.print(`@x${playerTrait.coins.toString().padStart(2, '0')}`, context, 96, LINE2);
    
            font.print('WORLD', context, 152, LINE1);
            font.print(level.name, context, 160, LINE2);
    
            font.print('TIME', context, 208, LINE1);
            font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), context, 216, LINE2);
        }
    }
};