export default class EventEmitter {
    constructor() {
        this.listeners = [];
    }

    listen(name, callback) {
        this.listeners.push({ name, callback });
    }

    emit(name, ...args) {
        const listener = this.listeners.find((listener) => listener.name === name);
        listener.callback(...args);
    }
}