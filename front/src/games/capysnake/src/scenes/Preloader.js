export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.add.image(cx, cy, 'background').setDisplaySize(this.scale.width, this.scale.height);

        this.add.rectangle(cx, cy, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(cx - 230, cy, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('capy', 'capy2.png');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
