import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';
import { Capy } from '../gameObjects/Capy.js';
import { Orange } from '../gameObjects/Orange.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.initVariables();
        this.initBackground();
        this.createAllSpawners();
        this.initUI();
        this.initAnimations();
        this.initPlayer();
        this.initInput();
    }

    initVariables() {
        this.score = 0;
        this.distance = 0;
        this.gameSpeed = 4;
        this.maxGameSpeed = 10;
        // Reglages du fond: augmente/reduis ces valeurs pour ajuster la vitesse.
        this.backgroundBaseScrollSpeed = 0.5;
        this.backgroundSpeedFactor = 0.8;
        this.obstacles = this.physics.add.group();
        this.coins = this.physics.add.group();
        this.oranges = this.physics.add.group();
        this.scrollX = 0;
        this.obstaclePositions = [];
    }

    createAllSpawners() {
        this.spawnObstacle();
        this.scheduleNextObstacle();
        this.spawnCoin();
        this.scheduleNextCoin();
        this.spawnOrange();
        this.scheduleNextOrange();
    }

    scheduleNextObstacle() {
        const randomDelay = Phaser.Math.Between(3000, 5000);
        this.time.addEvent({
            delay: randomDelay,
            callback: this.spawnObstacle,
            callbackScope: this,
            once: true
        });
    }

    scheduleNextCoin() {
        const randomDelay = Phaser.Math.Between(1500, 3500);
        this.time.addEvent({
            delay: randomDelay,
            callback: this.spawnCoin,
            callbackScope: this,
            once: true
        });
    }

    scheduleNextOrange() {
        const randomDelay = Phaser.Math.Between(3000, 4000);
        this.time.addEvent({
            delay: randomDelay,
            callback: this.spawnOrange,
            callbackScope: this,
            once: true
        });
    }

    isPositionClear(y, minDistance = 120) {
        for (const obsY of this.obstaclePositions) {
            if (Math.abs(y - obsY) < minDistance) {
                return false;
            }
        }
        return true;
    }

    initBackground() {
        this.randomBgKey = Phaser.Utils.Array.GetRandom(ASSETS.graphics.backgrounds);
        this.background = this.add
            .tileSprite(0, 0, this.scale.width, this.scale.height, this.randomBgKey)
            .setOrigin(0, 0)
            .setDepth(-100);

        this.resizeBackground();
        this.scale.on('resize', this.resizeBackground, this);
    }

    resizeBackground() {
        if (!this.background) {
            return;
        }

        this.background.setSize(this.scale.width, this.scale.height);

        const sourceImage = this.textures.get(this.randomBgKey).getSourceImage();
        const coverScale = this.scale.height / sourceImage.height;
        this.background.setTileScale(coverScale, coverScale);
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
            fill: '#ffffff'
        });

        // Altitude display
        this.altitudeText = this.add.text(20, 80, `Altitude: 300m`, {
            fontSize: '20px',
            fill: '#ffffff'
        });

        // Fuel bar background
        this.fuelBarBg = this.add.rectangle(675, 30, 120, 20, 0x333333);
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
        let randomY;
        let attempts = 0;
        do {
            randomY = Phaser.Math.Between(80, 480);
            attempts += 1;
        } while (!this.isPositionClear(randomY, 100) && attempts < 5);

        const obstacle = this.obstacles.create(900, randomY, 'obstacle');
        obstacle.setDisplaySize(100, 148);
        obstacle.body.setSize(100, 148, true);
        obstacle.setVelocityX(-this.gameSpeed * 100);
        
        obstacle.originalY = randomY;
        obstacle.oscillationSpeed = 0.05 + Math.random() * 0.04;
        obstacle.oscillationAmount = 30 + Math.random() * 20;
        obstacle.phase = Math.random() * Math.PI * 2;
        
        this.obstaclePositions.push(randomY);
        if (this.obstaclePositions.length > 5) {
            this.obstaclePositions.shift();
        }
        
        if (obstacle.x < -100) {
            obstacle.destroy();
        }

        this.scheduleNextObstacle();
    }

    spawnCoin() {
        const randomY = Phaser.Math.Between(50, 500);
        if (!this.isPositionClear(randomY, 80)) {
            this.scheduleNextCoin();
            return;
        }

        const coin = this.coins.create(900, randomY, 'coin');
        coin.setScale(0.55);
        coin.play(ANIMATION.coin.spin);
        coin.setVelocityX(-this.gameSpeed * 100);

        this.scheduleNextCoin();
    }

    spawnOrange() {
        const randomY = Phaser.Math.Between(80, 480);
        if (!this.isPositionClear(randomY, 80)) {
            this.scheduleNextOrange();
            return;
        }

        const orange = new Orange(this, 900, randomY);
        this.oranges.add(orange);
        orange.setVelocityX(-this.gameSpeed * 100);

        this.scheduleNextOrange();
    }

    update() {
        this.distance += this.gameSpeed * 0.1;
        this.scrollX += this.gameSpeed;
        this.background.tilePositionX += this.backgroundBaseScrollSpeed + (this.gameSpeed * this.backgroundSpeedFactor);

        // Augmenter la vitesse graduellement
        if (this.gameSpeed < this.maxGameSpeed) {
            this.gameSpeed += 0.001;
        }

        // Update obstacles velocity
        this.obstacles.children.entries.forEach(obstacle => {
            obstacle.setVelocityX(-this.gameSpeed * 100);

            obstacle.phase += obstacle.oscillationSpeed;
            const newY = obstacle.originalY + Math.sin(obstacle.phase) * obstacle.oscillationAmount;
            obstacle.y = newY;

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

        // Update oranges velocity
        this.oranges.children.entries.forEach(orange => {
            orange.setVelocityX(-this.gameSpeed * 100);
            if (orange.x < -100) {
                orange.destroy();
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

        // Collision avec oranges
        this.physics.overlap(this.capy, this.oranges, (capy, orange) => {
            orange.collect(this);
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
        this.scale.off('resize', this.resizeBackground, this);
        this.physics.pause();
        this.scene.start('GameOver', {
            score: this.score,
            distance: this.distance
        });
    }
}
