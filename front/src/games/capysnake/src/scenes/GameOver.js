export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create(data) {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(cx, cy, 'background').setDisplaySize(this.scale.width, this.scale.height).setAlpha(0.5);

        this.add.text(cx, cy - 80, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const score = data?.score ?? 0;
        const highScore = data?.highScore ?? 0;

        this.add.text(cx, cy + 20, `Score: ${score}`, {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(cx, cy + 70, `Best: ${highScore}`, {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(cx, cy + 140, 'Press SPACE or click to restart', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });

    }
}
