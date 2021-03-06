
export default class Trait {
    static EVENT_TASK = Symbol('task');
    constructor() {
        this.listeners = [];
    }

    listen(name, callback, count = Infinity) {
        this.listeners.push({ name, callback, count });
    }

    finalize(entity) {
        this.listeners = this.listeners.filter((listener) => {
            entity.events.process(listener.name, listener.callback);
            return --listener.count;
        });
    }

    queue(task) {
        this.listen(Trait.EVENT_TASK, task, 1);
    }

    collides(us, them) {

    }

    obstruct() {}

    update() {

    }
}