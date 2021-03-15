import TileResolver from "../tile-resolver.js";

export const createBackgroundLayer = (level, tiles, sprites) => {
    const resolver = new TileResolver(tiles);

    const buffer = document.createElement('canvas');
    buffer.width = 256 + 16;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    const redraw = (startIndex, endIndex) => {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = startIndex; x <= endIndex; x += 1) {
            const col = tiles.grid[x];

            if (col) {
                col.forEach((tile, y) => {
                    if (sprites.animations.has(tile.name)) {
                        sprites.drawAnim(tile.name, context, x - startIndex, y, level.totalTime);
                    } else {
                        sprites.drawTile(tile.name, context, x - startIndex, y);
                    }

                });
            }
        }
    };

    return (context, camera) => {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        context.drawImage(
            buffer,
            Math.floor(-camera.pos.x % 16),
            Math.floor(-camera.pos.y),
        );
    }
};