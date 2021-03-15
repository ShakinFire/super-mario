const createEntityLayer = (entities) => {
    return (context, camera) => {
        context.strokeStyle = 'red';
        entities.forEach((entity) => {
            context.beginPath();
            context.rect(
                entity.bounds.left - camera.pos.x,
                entity.bounds.top - camera.pos.y,
                entity.size.x,
                entity.size.y,
            );
            context.stroke();
        });
    };
};

const createTileCandidateLayer = (tileResolver) => {
    const resolvedTiles = [];
    const tileSize = tileResolver.tileSize;

    const getByIndexOriginal = tileResolver.getByIndex;

    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedTiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y); 
    }

    return (context, camera) => {
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
            context.stroke();
        });

        resolvedTiles.length = 0;
    };
}

export function createCollisionLayer(level) {
    const drawTileCandidates = level.tileCollider.resolvers.map((resolver) => createTileCandidateLayer(resolver));
    const drawBoundingBoxes = createEntityLayer(level.entities);

    return function drawCollision(context, camera) {
        drawTileCandidates.forEach((draw) => draw(context, camera));
        drawBoundingBoxes(context, camera);
    }
};