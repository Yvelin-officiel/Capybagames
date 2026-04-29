import ASSETS from '../assets.js';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image(ASSETS.graphics.capy, ASSETS.paths.capyJetpack);
        this.load.image(ASSETS.graphics.obstacle, ASSETS.paths.obstacle);
        this.load.spritesheet(ASSETS.graphics.coin, ASSETS.paths.coinSheet, {
            frameWidth: 64,
            frameHeight: 64,
            endFrame: 24
        });
        this.load.image(ASSETS.graphics.orange, ASSETS.paths.orange);

        ASSETS.graphics.backgrounds.forEach((key, index) => {
            this.load.image(key, ASSETS.paths.backgrounds[index]);
        });
    }

    create() {
        // Créer les graphiques du jeu
        this.createGraphics();
        this.scene.start('Start');
    }

    createGraphics() {
        // Créer les graphiques pour les sprites
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        this.createParallaxTextures(graphics);

        // Créer une particule d'exhaust
        graphics.fillStyle(0xFF6600, 0.8);
        graphics.fillRect(0, 0, 6, 6);
        graphics.generateTexture('particle', 6, 6);

        graphics.destroy();
    }

    createParallaxTextures(graphics) {
        const segmentWidth = 256;
        const segmentHeight = 180;

        for (let i = 0; i < 3; i += 1) {
            graphics.clear();
            graphics.fillStyle(0xffffff, 0.25 + i * 0.07);

            for (let c = 0; c < 6 + i; c += 1) {
                const x = 20 + c * 38 + Phaser.Math.Between(-10, 10);
                const y = 25 + Phaser.Math.Between(-10, 35);
                graphics.fillCircle(x, y, Phaser.Math.Between(12, 24));
                graphics.fillCircle(x + 18, y + Phaser.Math.Between(-3, 6), Phaser.Math.Between(8, 18));
            }

            graphics.generateTexture(ASSETS.parallax.sky[i], segmentWidth, segmentHeight);
        }

        for (let i = 0; i < 3; i += 1) {
            graphics.clear();
            const tone = 0x6aa3d6 - i * 0x0b0f11;
            graphics.fillStyle(tone, 0.8);

            let cursorX = 0;
            while (cursorX < segmentWidth + 80) {
                const peakWidth = Phaser.Math.Between(60, 110);
                const peakHeight = Phaser.Math.Between(35, 85);
                graphics.fillTriangle(
                    cursorX,
                    segmentHeight,
                    cursorX + peakWidth * 0.5,
                    segmentHeight - peakHeight,
                    cursorX + peakWidth,
                    segmentHeight
                );
                cursorX += peakWidth - 18;
            }

            graphics.generateTexture(ASSETS.parallax.mountains[i], segmentWidth, segmentHeight);
        }

        for (let i = 0; i < 3; i += 1) {
            graphics.clear();
            graphics.fillStyle(0x3d4b73 + i * 0x050505, 0.95);

            let cursorX = 0;
            while (cursorX < segmentWidth) {
                const w = Phaser.Math.Between(20, 44);
                const h = Phaser.Math.Between(50, 130);
                graphics.fillRect(cursorX, segmentHeight - h, w, h);
                cursorX += w + Phaser.Math.Between(4, 10);
            }

            graphics.generateTexture(ASSETS.parallax.city[i], segmentWidth, segmentHeight);
        }
    }
}
