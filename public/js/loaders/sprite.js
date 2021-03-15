import { createAnim } from '../anim.js';
import { loadJson, loadImage } from '../loaders.js';
import SpriteSheet from '../sprite-sheet.js';

export const loadSpriteSheet = (name) => {
    return loadJson(`/sprites/${name}.json`)
        .then((sheetSpec) => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageURL),
        ]))
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

            if (sheetSpec.tiles) {
                sheetSpec.tiles.forEach((tileSpec) => {
                    sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);
                });
            }

            if (sheetSpec.frames) {
                sheetSpec.frames.forEach((frameSpec) => {
                    sprites.define(frameSpec.name, ...frameSpec.rect);
                });
            }

            if (sheetSpec.animations) {
                sheetSpec.animations.forEach((animSpec) => {
                    const animation = createAnim(animSpec.frames, animSpec.frameLen);
                    sprites.defineAnim(animSpec.name, animation);
                });
            }

            return sprites
        });
};