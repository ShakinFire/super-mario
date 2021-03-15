import Player from "../traits/player.js";

const handle = ({ entity, match, resolver }) => {
    if (entity.traits.has(Player)) {
        entity.traits.get(Player).addCoins(1);
        const grid = resolver.matrix;
        grid.delete(match.indexX, match.indexY);
    }
};

export const coin = [handle, handle];