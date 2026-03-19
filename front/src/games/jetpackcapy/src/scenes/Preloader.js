import ASSETS from '../assets.js';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image(ASSETS.graphics.capy, ASSETS.paths.capyJetpack);
        this.load.spritesheet(ASSETS.graphics.coin, ASSETS.paths.coinSheet, {
            frameWidth: 64,
            frameHeight: 64,
            endFrame: 24
        });
    }

    create() {
        // Créer les graphiques du jeu
        this.createGraphics();
        this.scene.start('Game');
    }

    createGraphics() {
        // Créer les graphiques pour les sprites
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Créer un obstacle
        graphics.fillStyle(0xFF4500, 1);
        graphics.fillRect(0, 0, 50, 100);
        graphics.generateTexture('obstacle', 50, 100);

        // Créer une particule d'exhaust
        graphics.fillStyle(0xFF6600, 0.8);
        graphics.fillRect(0, 0, 6, 6);
        graphics.generateTexture('particle', 6, 6);

        graphics.destroy();
    }
}
