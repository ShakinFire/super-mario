import InputRouter from './input-router.js';
import Keyboard from './keyboard-state.js';
import Go from './traits/go.js';
import Jump from './traits/jump.js';

export const setupKeyboard = (window) => {
    const input = new Keyboard();
    const router = new InputRouter();

    input.listenTo(window);

    input.addMapping('KeyP', (keyState) => {
        if (keyState) {
            router.route((entity) => entity.traits.get(Jump).start());
        } else {
            router.route((entity) => entity.traits.get(Jump).cancel());
        }
    });

    input.addMapping('KeyO', (keyState) => {
        router.route((entity) => entity.turbo(keyState));
    });

    input.addMapping('KeyD', (keyState) => {
        router.route((entity) => entity.traits.get(Go).dir += keyState ? 1 : -1);
    });

    input.addMapping('KeyA', (keyState) => {
        router.route((entity) => entity.traits.get(Go).dir += keyState ? -1 : 1);
    });

    return router;
};