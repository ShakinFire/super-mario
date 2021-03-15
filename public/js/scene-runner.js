import Scene from "./scene.js";

export default class SceneRunner {
    constructor() {
        this.sceneIndex = -1;
        this.scenes = [];
    }

    addScene(scene) {
        scene.events.listen(Scene.EVENT_COMPLETE, () => {
            this.runNext();
        });

        this.scenes.push(scene);
    }

    runNext() {
        const currentScene = this.scenes[this.sceneIndex];

        if (currentScene) {
            currentScene.pause();
        }

        this.sceneIndex += 1;
    }

    update(gameContext) {
        const currentScene = this.scenes[this.sceneIndex];

        if (currentScene) {
            currentScene.update(gameContext);
            currentScene.draw(gameContext);
        }
    }
}