import ASSETS from '../assets.js';

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score || 0;
        this.distance = data.distance || 0;
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

        // Afficher le score final
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.72);
        
        this.add.text(400, 150, 'GAME OVER', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 250, `Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#FFD700'
        }).setOrigin(0.5);

        this.add.text(400, 320, `Distance: ${Math.round(this.distance)}m`, {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.text(400, 450, 'Cliquez pour revenir au titre', {
            fontSize: '20px',
            fill: '#87CEEB',
            backgroundColor: '#004d99',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.backToTitle());

        // Input au clavier aussi
        this.input.keyboard.once('keydown-SPACE', () => this.backToTitle());
        this.input.keyboard.once('keydown-ENTER', () => this.backToTitle());
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

    backToTitle() {
        this.scale.off('resize', this.resizeBackground, this);
        this.scene.start('Start');
    }
}
