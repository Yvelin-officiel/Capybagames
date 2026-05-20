import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { Capy } from "../gameObjects/Capy.js";
import { Orange } from "../gameObjects/Orange.js";

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.isMobile = this.gameWidth < 768;

    this.initVariables();
    this.initBackground();
    this.createAllSpawners();
    this.initUI();
    this.initAnimations();
    this.initPlayer();
    this.initInput();
    this.initCollisions();

    this.scale.on("resize", this.onResize, this);

    // Pause automatique quand l'app perd le focus
    this.game.events.on(Phaser.Core.Events.BLUR, () => {
      this.scene.pause();
    });
  }

  initVariables() {
    this.score = 0;
    this.distance = 0;

    // Vitesse adaptée mobile
    this.gameSpeed = this.isMobile ? 3 : 4;
    this.maxGameSpeed = this.isMobile ? 7 : 10;

    // Background
    this.backgroundBaseScrollSpeed = 0.5;
    this.backgroundSpeedFactor = 0.8;

    this.obstacles = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.oranges = this.physics.add.group();

    this.scrollX = 0;
    this.obstaclePositions = [];
  }

  onResize(gameSize) {
    this.gameWidth = gameSize.width;
    this.gameHeight = gameSize.height;
    this.isMobile = this.gameWidth < 768;

    this.resizeBackground();

    // Reposition HUD
    const padding = this.isMobile ? 10 : 20;
    const fuelWidth = this.isMobile ? 80 : 120;

    this.scoreText.setPosition(padding, padding);
    this.distanceText.setPosition(padding, padding + 25);
    this.altitudeText.setPosition(padding, padding + 50);

    this.fuelBarBg.setPosition(this.gameWidth - fuelWidth, 30);

    this.fuelBar.setPosition(
      this.gameWidth - fuelWidth - fuelWidth / 2 + 10,
      30,
    );

    this.fuelText.setPosition(this.gameWidth - fuelWidth - 80, 15);

    if (this.fullscreenBtn) {
      this.fullscreenBtn.setPosition(this.gameWidth - 40, this.gameHeight - 40);
    }
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
      once: true,
    });
  }

  scheduleNextCoin() {
    const randomDelay = Phaser.Math.Between(1500, 3500);

    this.time.addEvent({
      delay: randomDelay,
      callback: this.spawnCoin,
      callbackScope: this,
      once: true,
    });
  }

  scheduleNextOrange() {
    const randomDelay = Phaser.Math.Between(3000, 4000);

    this.time.addEvent({
      delay: randomDelay,
      callback: this.spawnOrange,
      callbackScope: this,
      once: true,
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
    this.randomBgKey = Phaser.Utils.Array.GetRandom(
      ASSETS.graphics.backgrounds,
    );

    this.background = this.add
      .tileSprite(0, 0, this.gameWidth, this.gameHeight, this.randomBgKey)
      .setOrigin(0, 0)
      .setDepth(-100);

    this.resizeBackground();
  }

  resizeBackground() {
    if (!this.background) {
      return;
    }

    this.background.setSize(this.gameWidth, this.gameHeight);

    const sourceImage = this.textures.get(this.randomBgKey).getSourceImage();

    const coverScale = this.gameHeight / sourceImage.height;

    this.background.setTileScale(coverScale, coverScale);
  }

  initUI() {
    const padding = this.isMobile ? 10 : 20;

    const titleSize = this.isMobile ? "16px" : "24px";

    const textSize = this.isMobile ? "14px" : "20px";

    const fuelWidth = this.isMobile ? 80 : 120;

    // SCORE
    this.scoreText = this.add.text(padding, padding, "Score: 0", {
      fontSize: titleSize,
      fill: "#FFFFFF",
      fontStyle: "bold",
    });

    // DISTANCE
    this.distanceText = this.add.text(padding, padding + 25, "Distance: 0m", {
      fontSize: textSize,
      fill: "#FFFFFF",
    });

    // ALTITUDE
    this.altitudeText = this.add.text(padding, padding + 50, "Altitude: 300m", {
      fontSize: textSize,
      fill: "#FFFFFF",
    });

    // FUEL BG
    this.fuelBarBg = this.add.rectangle(
      this.gameWidth - fuelWidth,
      30,
      fuelWidth,
      20,
      0x333333,
    );

    // FUEL BAR
    this.fuelBar = this.add.rectangle(
      this.gameWidth - fuelWidth - fuelWidth / 2 + 10,
      30,
      fuelWidth - 20,
      16,
      0x00ff00,
    );

    this.fuelBar.setOrigin(0, 0.5);

    // FUEL TEXT
    this.fuelText = this.add.text(
      this.gameWidth - fuelWidth - 80,
      15,
      "Fuel:",
      {
        fontSize: this.isMobile ? "10px" : "12px",

        fill: "#FFFFFF",
        fontStyle: "bold",
      },
    );

    // FULLSCREEN BUTTON
    this.fullscreenBtn = this.add
      .text(this.gameWidth - 40, this.gameHeight - 40, "⛶", {
        fontSize: this.isMobile ? "24px" : "32px",

        fill: "#FFFFFF",
      })
      .setInteractive();

    this.fullscreenBtn.on("pointerdown", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  initPlayer() {
    this.capy = new Capy(this, this.gameWidth * 0.05, this.gameHeight * 0.2);
    this.capy.setScale(0.2, 0.3);
  }

  initAnimations() {
    if (!this.anims.exists(ANIMATION.coin.spin)) {
      this.anims.create({
        key: ANIMATION.coin.spin,

        frames: this.anims.generateFrameNumbers(ASSETS.graphics.coin, {
          start: 0,
          end: 24,
        }),

        frameRate: 24,
        repeat: -1,
      });
    }
  }

  initInput() {
    // Zone tactile fullscreen
    const zone = this.add
      .zone(0, 0, this.gameWidth, this.gameHeight)
      .setOrigin(0)
      .setInteractive();

    zone.on("pointerdown", () => {
      this.capy.activateJetpack();
    });

    zone.on("pointerup", () => {
      this.capy.deactivateJetpack();
    });

    zone.on("pointerout", () => {
      this.capy.deactivateJetpack();
    });

    // Clavier
    this.input.keyboard.on("keydown-SPACE", () => {
      this.capy.activateJetpack();
    });

    this.input.keyboard.on("keyup-SPACE", () => {
      this.capy.deactivateJetpack();
    });

    this.input.keyboard.on("keydown-UP", () => {
      this.capy.activateJetpack();
    });

    this.input.keyboard.on("keyup-UP", () => {
      this.capy.deactivateJetpack();
    });
  }

  initCollisions() {
    // Obstacles
    this.physics.add.overlap(this.capy, this.obstacles, () => {
      this.endGame();
    });

    // Coins
    this.physics.add.overlap(this.capy, this.coins, (capy, coin) => {
      this.score += 10;
      coin.destroy();
    });

    // Oranges
    this.physics.add.overlap(this.capy, this.oranges, (capy, orange) => {
      orange.collect(this);
    });
  }

  spawnObstacle() {
    const margin = this.gameHeight * 0.15;

    let randomY;
    let attempts = 0;

    do {
      randomY = Phaser.Math.Between(margin, this.gameHeight - margin);

      attempts += 1;
    } while (!this.isPositionClear(randomY, 120) && attempts < 5);

    const obstacle = this.obstacles.create(
      this.gameWidth + 120,
      randomY,
      "obstacle",
    );

    // Taille responsive
    const obstacleScale = this.isMobile ? 0.45 : 0.65;

    obstacle.setScale(obstacleScale);

    const hitboxWidth = obstacle.displayWidth;

    const hitboxHeight = obstacle.displayHeight;

    obstacle.body.setSize(hitboxWidth, hitboxHeight);

    // Centre la hitbox
    obstacle.body.setOffset(
      (obstacle.width - hitboxWidth) / 2,
      (obstacle.height - hitboxHeight) / 2,
    );

    obstacle.setVelocityX(-this.gameSpeed * 100);

    // Mouvement oscillant
    obstacle.originalY = randomY;

    obstacle.oscillationSpeed = 0.05 + Math.random() * 0.04;

    obstacle.oscillationAmount = this.isMobile
      ? 15 + Math.random() * 10
      : 30 + Math.random() * 20;

    obstacle.phase = Math.random() * Math.PI * 2;

    this.obstaclePositions.push(randomY);

    if (this.obstaclePositions.length > 5) {
      this.obstaclePositions.shift();
    }

    this.scheduleNextObstacle();
  }

  spawnCoin() {
    const margin = this.gameHeight * 0.1;

    const randomY = Phaser.Math.Between(margin, this.gameHeight - margin);

    if (!this.isPositionClear(randomY, 80)) {
      this.scheduleNextCoin();
      return;
    }

    const coin = this.coins.create(this.gameWidth + 100, randomY, "coin");

    coin.setScale(this.isMobile ? 0.45 : 0.55);

    coin.play(ANIMATION.coin.spin);

    coin.setVelocityX(-this.gameSpeed * 100);

    this.scheduleNextCoin();
  }

  spawnOrange() {
    const margin = this.gameHeight * 0.15;

    const randomY = Phaser.Math.Between(margin, this.gameHeight - margin);

    if (!this.isPositionClear(randomY, 80)) {
      this.scheduleNextOrange();
      return;
    }

    const orange = new Orange(this, this.gameWidth + 100, randomY);

    this.oranges.add(orange);

    orange.setVelocityX(-this.gameSpeed * 100);

    this.scheduleNextOrange();
  }

  update() {
    this.distance += this.gameSpeed * 0.1;

    this.scrollX += this.gameSpeed;

    this.background.tilePositionX +=
      this.backgroundBaseScrollSpeed +
      this.gameSpeed * this.backgroundSpeedFactor;

    // Augmentation progressive vitesse
    if (this.gameSpeed < this.maxGameSpeed) {
      this.gameSpeed += 0.001;
    }

    // Obstacles
    this.obstacles.children.entries.forEach((obstacle) => {
      obstacle.setVelocityX(-this.gameSpeed * 100);

      obstacle.phase += obstacle.oscillationSpeed;

      obstacle.y =
        obstacle.originalY +
        Math.sin(obstacle.phase) * obstacle.oscillationAmount;

      if (obstacle.x < -200) {
        obstacle.destroy();
      }
    });

    // Coins
    this.coins.children.entries.forEach((coin) => {
      coin.setVelocityX(-this.gameSpeed * 100);

      if (coin.x < -200) {
        coin.destroy();
      }
    });

    // Oranges
    this.oranges.children.entries.forEach((orange) => {
      orange.setVelocityX(-this.gameSpeed * 100);

      if (orange.x < -200) {
        orange.destroy();
      }
    });

    const capyBottom = this.capy.y + this.capy.displayHeight / 2;

    if (capyBottom >= this.gameHeight) {
      this.endGame();
    }

    // HUD
    this.scoreText.setText(`Score: ${this.score}`);

    this.distanceText.setText(`Distance: ${Math.round(this.distance)}m`);

    this.altitudeText.setText(
      `Altitude: ${Math.round(this.gameHeight - this.capy.y)}m`,
    );

    // Fuel
    const fuelPercent = Phaser.Math.Clamp(
      this.capy.jetpackFuel / this.capy.maxFuel,
      0,
      1,
    );

    this.fuelBar.setScale(fuelPercent, 1);

    this.fuelBar.setFillStyle(this.capy.jetpackActive ? 0xff6600 : 0x00ff00);

    // Player
    this.capy.update();
  }

  endGame() {
    this.scale.off("resize", this.onResize, this);

    this.physics.pause();

    this.scene.start("GameOver", {
      score: this.score,
      distance: this.distance,
    });
  }
}
