import Entity from '../entity.js';
import Trait from '../trait.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import PendulumMove from '../traits/pendulum-move.js';
import Killable from '../traits/killable.js';
import Solid from '../traits/solid.js';
import Physics from '../traits/physics.js';
import Stomper from '../traits/stomper.js';

export const loadKoopa = () => {
    return loadSpriteSheet('koopa')
        .then((sprite) => createKoopaFactory(sprite));
};

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANIC = Symbol('panic');

class Behavior extends Trait {
    constructor() {
        super();
        this.hideTime = 0;
        this.hideDuration = 5;
        this.panicSpeed = 300;
        this.walkSpeed = null;
        this.state = STATE_WALKING;
    }

    collides(us, them) {
        if (us.traits.get(Killable).isDead) {
            return;
        }

        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handleNudge(us, them);
            }
        }
    }
    
    handleNudge(us, them) {
        if (this.state === STATE_WALKING) {
            them.traits.get(Killable).kill();
        } else if (this.state === STATE_HIDING) {
            this.panic(us, them);
        } else if (this.state === STATE_PANIC) {
            const travelDir = Math.sign(us.vel.x);
            const impactDir = Math.sign(us.pos.x - them.pos.x);
            if (travelDir !== 0 && travelDir !== impactDir) {
                them.traits.get(Killable).kill();
            }
        }
    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) {
            this.hide(us);
        } else if (this.state === STATE_HIDING) {
            us.traits.get(Killable).kill();
            us.vel.set(100, -200);
            us.traits.get(Solid).obstructs = false;
        } else if (this.state === STATE_PANIC) {
            this.hide(us);
        }
    }

    panic(us, them) {
        us.traits.get(PendulumMove).enabled = true;
        us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATE_PANIC;
    }

    hide(us) {
        us.vel.x = 0;
        us.traits.get(PendulumMove).enabled = false;
        if (!this.walkSpeed) {
            this.walkSpeed = us.traits.get(PendulumMove).speed;
        }

        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(us) {
        us.traits.get(PendulumMove).enabled = true;
        us.traits.get(PendulumMove).speed = this.walkSpeed;

        this.state = STATE_WALKING;
    }

    update(us, { deltaTime }) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;

            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}

const createKoopaFactory = (sprite) => {
    const walkAnim = sprite.animations.get('walk');
    const wakeAnim = sprite.animations.get('wake');

    const routeAnim = (koopa) => {
        if (koopa.traits.get(Behavior).state === STATE_HIDING) {
            if (koopa.traits.get(Behavior).hideTime > 3) {
                return wakeAnim(koopa.traits.get(Behavior).hideTime);
            }
            return 'hiding';
        }

        if (koopa.traits.get(Behavior).state === STATE_PANIC) {
            return 'hiding';
        }

        return walkAnim(koopa.lifetime);
    };

    function drawKoopa (context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
    }

    return () => {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new Physics());
        koopa.addTrait(new Solid());
        koopa.addTrait(new PendulumMove());
        koopa.addTrait(new Behavior());
        koopa.addTrait(new Killable());

        koopa.draw = drawKoopa;

        return koopa;
    };
};