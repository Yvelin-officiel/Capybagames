import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';
import { Capy } from '../gameObjects/Capy.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.initVariables();
        this.initUI();
        this.initAnimations();
        this.initPlayer();
        this.initInput();
        this.createObstacles();
        this.createCoins();
    }

    initVariables() {
        this.score = 0;
        this.distance = 0;
        this.gameSpeed = 5;
        this.maxGameSpeed = 10;
        this.obstacles = this.physics.add.group();
        this.coins = this.physics.add.group();
        this.scrollX = 0;
    }

    initUI() {
        // Score display
        this.scoreText = this.add.text(20, 20, `Score: 0`, {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontStyle: 'bold'
        });

        // Distance display
        this.distanceText = this.add.text(20, 50, `Distance: 0m`, {
            fontSize: '20px',
            fill: '#87CEEB'
        });

        // Altitude display
        this.altitudeText = this.add.text(20, 80, `Altitude: 300m`, {
            fontSize: '20px',
            fill: '#87CEEB'
        });

        // Fuel bar background
        this.fuelBarBg = this.add.rectangle(675, 30, 110, 20, 0x333333);
        this.fuelBarBg.setOrigin(0.5, 0.5);
        
        // Fuel bar
        this.fuelBar = this.add.rectangle(630, 30, 100, 16, 0x00FF00);
        this.fuelBar.setOrigin(0, 0.5);
        
        // Fuel text
        this.fuelText = this.add.text(550, 15, `Fuel:`, {
            fontSize: '12px',
            fill: '#FFFFFF',
            fontStyle: 'bold'
        });
    }

    initPlayer() {
        this.capy = new Capy(this, 100, 300);
    }

    initAnimations() {
        if (!this.anims.exists(ANIMATION.coin.spin)) {
            this.anims.create({
                key: ANIMATION.coin.spin,
                frames: this.anims.generateFrameNumbers(ASSETS.graphics.coin, {
                    start: 0,
                    end: 24
                }),
                frameRate: 24,
                repeat: -1
            });
        }
    }

    initInput() {
        // Contrôle au click/touch pour le jetpack
        this.input.on('pointerdown', () => {
            this.capy.activateJetpack();
        });

        this.input.on('pointerup', () => {
            this.capy.deactivateJetpack();
        });

        // Contrôle au clavier (espace ou flèche haut)
        this.input.keyboard.on('keydown-SPACE', () => {
            this.capy.activateJetpack();
        });

        this.input.keyboard.on('keyup-SPACE', () => {
            this.capy.deactivateJetpack();
        });

        this.input.keyboard.on('keydown-UP', () => {
            this.capy.activateJetpack();
        });

        this.input.keyboard.on('keyup-UP', () => {
            this.capy.deactivateJetpack();
        });
    }

    createObstacles() {
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
    }

    spawnObstacle() {
        const randomY = Phaser.Math.Between(50, 500);
        const obstacle = this.obstacles.create(900, randomY, 'obstacle');
        obstacle.setVelocityX(-this.gameSpeed * 100);
        
        // Détruire si hors écran
        if (obstacle.x < -100) {
            obstacle.destroy();
        }
    }

    createCoins() {
        this.time.addEvent({
            delay: 2500,
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
        });
    }

    spawnCoin() {
        const randomY = Phaser.Math.Between(50, 500);
        const coin = this.coins.create(900, randomY, 'coin');
        coin.setScale(0.55);
        coin.play(ANIMATION.coin.spin);
        coin.setVelocityX(-this.gameSpeed * 100);
    }

    update() {
        this.distance += this.gameSpeed * 0.1;
        this.scrollX += this.gameSpeed;

        // Augmenter la vitesse graduellement
        if (this.gameSpeed < this.maxGameSpeed) {
            this.gameSpeed += 0.001;
        }

        // Update obstacles velocity
        this.obstacles.children.entries.forEach(obstacle => {
            obstacle.setVelocityX(-this.gameSpeed * 100);
            if (obstacle.x < -100) {
                obstacle.destroy();
            }
        });

        // Update coins velocity
        this.coins.children.entries.forEach(coin => {
            coin.setVelocityX(-this.gameSpeed * 100);
            if (coin.x < -100) {
                coin.destroy();
            }
        });

        // Collision avec obstacles
        this.physics.overlap(this.capy, this.obstacles, () => {
            this.endGame();
        });

        // Collision avec pièces
        this.physics.overlap(this.capy, this.coins, (capy, coin) => {
            this.score += 10;
            coin.destroy();
        });

        // Vérifier si le capy est hors limites
        if (this.capy.y < 0 || this.capy.y > 600) {
            this.endGame();
        }

        // Update UI
        this.scoreText.setText(`Score: ${this.score}`);
        this.distanceText.setText(`Distance: ${Math.round(this.distance)}m`);
        this.altitudeText.setText(`Altitude: ${Math.round(600 - this.capy.y)}m`);

        // Update fuel bar
        const fuelPercent = Phaser.Math.Clamp(this.capy.jetpackFuel / this.capy.maxFuel, 0, 1);
        this.fuelBar.setScale(fuelPercent, 1);
        this.fuelBar.setFillStyle(this.capy.jetpackActive ? 0xFF6600 : 0x00FF00);

        // Update capy
        this.capy.update();
    }

    endGame() {
        this.physics.pause();
        this.scene.start('GameOver', {
            score: this.score,
            distance: this.distance
        });
    }
}
