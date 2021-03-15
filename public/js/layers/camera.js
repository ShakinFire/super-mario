export const createCameraLayer = (cameraToDraw) => {
    return (context, fromCamera) => {
        context.strokeStyle = 'purple';
        context.beginPath();
        context.rect(
            cameraToDraw.pos.x - fromCamera.pos.x,
            cameraToDraw.pos.y - fromCamera.pos.y,
            cameraToDraw.size.x, cameraToDraw.size.y,
        );
        context.stroke();
    }
};