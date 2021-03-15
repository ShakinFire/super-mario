const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
    constructor() {
        // Hold the current state of a given key
        this.keyStates = new Map();

        // Holds the callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(code, cb) {
        this.keyMap.set(code, cb);
    }

    handleEvent(event) {
        const { code } = event;
        if (!this.keyMap.has(code)) {
            // Did not have key mapped
            return;
        }

        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);
        this.keyMap.get(code)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach((eventName) => {
            window.addEventListener(eventName, (event) => {
                this.handleEvent(event);
            });
        });
    }
}