export default class EntityCollider {
    constructor(entities) {
        this.entities = entities;
    }

    check(subject, level) {
        this.entities.forEach((candidate) => {
            if (subject === candidate) {
                return;
            }

            if (subject.bounds.overlaps(candidate.bounds)) {
                subject.collides(candidate, level);
            }
        })
    }
}