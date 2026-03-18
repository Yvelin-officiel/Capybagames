export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score || 0;
        this.distance = data.distance || 0;
    }

    create() {
        // Afficher le score final
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
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

        this.add.text(400, 450, 'Cliquez pour rejouer', {
            fontSize: '20px',
            fill: '#87CEEB',
            backgroundColor: '#004d99',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Game'));

        // Input au clavier aussi
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('Game'));
    }
}
