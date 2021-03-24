import { createLevelLoader } from './loaders/level.js';
import Timer from './timer.js';
import { setupKeyboard } from './input.js';
import { createCollisionLayer } from './layers/collision.js';
import { loadEntities } from './entities.js';
import { loadFont } from './loaders/font.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { makePlayer, createPlayerEnv, findPlayers } from './player.js';
import SceneRunner from './scene-runner.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import TimedScene from './timed-scene.js';
import { createColorLayer } from './layers/color.js';
import Level from './level.js';
import { createTextLayer } from './layers/text.js';

const main = async (canvas) => {
    const videoContext = canvas.getContext('2d');
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

    const loadLevel = await createLevelLoader(entityFactory);
    const sceneRunner = new SceneRunner();

    const mario = entityFactory.mario();
    makePlayer(mario, 'MARIO');

    // level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera));

    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);

    const runLevel = async (name) => {
        const loadScreen = new TimedScene();
        loadScreen.comp.layers.push(createColorLayer('#000'));
        loadScreen.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
        sceneRunner.addScene(loadScreen);
        sceneRunner.runNext();

        const level = await loadLevel(name);

        level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
            if (spec.type === 'goto') {
                for(const _ of findPlayers(touches)) {
                    runLevel(spec.name);
                    return;
                }
            }
        });
        const dashboardLayer = createDashboardLayer(font, level);
        const playerProgressLayer = createPlayerProgressLayer(font, level);

        mario.pos.set(0, 0);
        level.entities.add(mario);

        const playerEnv = createPlayerEnv(mario);
        level.entities.add(playerEnv);
    
        const waitScreen = new TimedScene();
        waitScreen.comp.layers.push(createColorLayer('#000'));
        waitScreen.comp.layers.push(dashboardLayer);
        waitScreen.comp.layers.push(playerProgressLayer);
        sceneRunner.addScene(waitScreen);
        
        level.comp.layers.push(createCollisionLayer(level));
        level.comp.layers.push(dashboardLayer);
        sceneRunner.addScene(level);

        sceneRunner.runNext();
    };

    const gameContext = {
        deltaTime: null,
        entityFactory,
        videoContext,
        audioContext,
    };

    // setupMouseControl(canvas, mario, camera);

    const timer = new Timer(1 / 60);
    timer.update = (deltaTime) => {
        gameContext.deltaTime = deltaTime;
        sceneRunner.update(gameContext);
    }

    timer.start();

    runLevel('1-1');
};

const canvas = document.getElementById('screen');

const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};

window.addEventListener('click', start);
