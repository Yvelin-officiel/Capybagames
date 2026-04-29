import ASSETS from '../assets.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        this.scrollSpeed = 0.35;
        this.randomBgKey = Phaser.Utils.Array.GetRandom(ASSETS.graphics.backgrounds);

        this.background = this.add
            .tileSprite(0, 0, this.scale.width, this.scale.height, this.randomBgKey)
            .setOrigin(0, 0)
            .setDepth(-100);

        this.resizeBackground();
        this.scale.on('resize', this.resizeBackground, this);

        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.25)
            .setDepth(-50);

        this.add.text(this.scale.width / 2, 120, 'JETPACK CAPY', {
            fontSize: '54px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#1b1b1b',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 205, 'Un capybara, un jetpack, des oranges et des pièces', {
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#1b1b1b',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 315, 'Clique / appuie sur ESPACE pour commencer', {
            fontSize: '22px',
            color: '#fff2b3',
            stroke: '#1b1b1b',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 395, 'Gère le fuel et évite les obstacles ondulants', {
            fontSize: '18px',
            color: '#ffffff',
            stroke: '#1b1b1b',
            strokeThickness: 3
        }).setOrigin(0.5);

        const startButton = this.add.rectangle(this.scale.width / 2, 500, 260, 68, 0xff9f1c, 0.95)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(this.scale.width / 2, 500, 'JOUER', {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#5b2d00',
            strokeThickness: 4
        }).setOrigin(0.5);

        startButton.on('pointerdown', () => this.startGame());
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());
        this.input.keyboard.once('keydown-ENTER', () => this.startGame());
    }

    resizeBackground() {
        if (!this.background) {
            return;
        }

        this.background.setSize(this.scale.width, this.scale.height);

        const sourceImage = this.textures.get(this.randomBgKey).getSourceImage();
        const coverScale = Math.max(this.scale.width / sourceImage.width, this.scale.height / sourceImage.height);
        this.background.setTileScale(coverScale, coverScale);
    }

    update() {
        if (this.background) {
            this.background.tilePositionX += this.scrollSpeed;
        }
    }

    startGame() {
        this.scale.off('resize', this.resizeBackground, this);
        this.scene.start('Game');
    }
}
