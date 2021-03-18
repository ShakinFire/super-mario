import Entity from '../entity.js';
import Jump from '../traits/jump.js';
import Stomper from '../traits/stomper.js';
import Killable from '../traits/killable.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import Go from '../traits/go.js';
import Solid from '../traits/solid.js';
import Physics from '../traits/physics.js';
import { loadAudioBoard } from '../loaders/audio.js';
import PoleTraveller from '../traits/pole-traveller.js';

const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

export const loadMario = async (audioContext) => {
    const [sprite, audio] = await Promise.all([
        loadSpriteSheet('mario'),
        loadAudioBoard('mario', audioContext),
    ]);

    return createMarioFactory(sprite, audio);
};

const createMarioFactory = (sprite, audio) => {
    const runAnim = sprite.animations.get('run');

    const routeFrame = (mario) => {
        const goTrait = mario.traits.get(Go);

        if (mario.traits.get(Jump).ready < 0) {
            return 'jump';
        }

        if (goTrait.distance > 0) {
            if ((mario.vel.x > 0 && goTrait.dir < 0) || (mario.vel.x < 0 && goTrait.dir > 0)) {
                return 'break';
            }

            return runAnim(goTrait.distance);
        }

        return 'idle';
    };

    function setTurboState(turboOn) {
        this.traits.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function drawMario (context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.traits.get(Go).heading < 0);
    }

    return () => {
        const mario = new Entity();
        mario.audio = audio;
        mario.size.set(14, 16);

        mario.addTrait(new Physics());
        mario.addTrait(new Solid());
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Killable());
        mario.addTrait(new Stomper());
        mario.addTrait(new PoleTraveller())

        mario.traits.get(Killable).removeAfter = 0;
        mario.turbo = setTurboState;
        mario.draw = drawMario;

        mario.turbo(false);

        return mario;
    };
};