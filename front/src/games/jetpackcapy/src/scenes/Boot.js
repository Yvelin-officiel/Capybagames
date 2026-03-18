export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    create() {
        // Initialisation du jeu
        this.scene.start('Preloader');
    }
}
