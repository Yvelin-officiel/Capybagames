import ASSETS from "../assets.js";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.isMobile = this.gameWidth < 768;

    this.createLoadingUI();

    // Assets principaux
    this.load.image(ASSETS.graphics.capy, ASSETS.paths.capyJetpack);

    this.load.image(ASSETS.graphics.obstacle, ASSETS.paths.obstacle);

    this.load.spritesheet(ASSETS.graphics.coin, ASSETS.paths.coinSheet, {
      frameWidth: 64,
      frameHeight: 64,
      endFrame: 24,
    });

    this.load.image(ASSETS.graphics.orange, ASSETS.paths.orange);

    // Backgrounds
    ASSETS.graphics.backgrounds.forEach((key, index) => {
      this.load.image(key, ASSETS.paths.backgrounds[index]);
    });

    // Progression du chargement
    this.load.on("progress", (value) => {
      this.updateLoadingBar(value);
    });

    // Resize mobile
    this.scale.on("resize", this.onResize, this);
  }

  create() {
    // Création des textures procédurales
    this.createGraphics();

    // Nettoyage listeners
    this.scale.off("resize", this.onResize, this);

    // Transition
    this.scene.start("Start");
  }

  onResize(gameSize) {
    this.gameWidth = gameSize.width;
    this.gameHeight = gameSize.height;
    this.isMobile = this.gameWidth < 768;

    this.repositionLoadingUI();
  }

  createLoadingUI() {
    const centerX = this.gameWidth / 2;
    const centerY = this.gameHeight / 2;

    const barWidth = this.isMobile ? this.gameWidth * 0.7 : 400;

    const barHeight = this.isMobile ? 18 : 24;

    // Fond
    this.cameras.main.setBackgroundColor("#87CEEB");

    // Titre
    this.loadingTitle = this.add
      .text(centerX, centerY - 80, "🚀 Jetpack Capy", {
        fontSize: this.isMobile ? "28px" : "42px",

        fill: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Texte loading
    this.loadingText = this.add
      .text(centerX, centerY - 20, "Chargement...", {
        fontSize: this.isMobile ? "16px" : "22px",

        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Background barre
    this.loadingBarBg = this.add.rectangle(
      centerX,
      centerY + 30,
      barWidth,
      barHeight,
      0x333333,
    );

    // Barre progression
    this.loadingBar = this.add.rectangle(
      centerX - barWidth / 2,
      centerY + 30,
      0,
      barHeight - 4,
      0x00ff88,
    );

    this.loadingBar.setOrigin(0, 0.5);

    // Pourcentage
    this.loadingPercent = this.add
      .text(centerX, centerY + 70, "0%", {
        fontSize: this.isMobile ? "14px" : "18px",

        fill: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.loadingBarMaxWidth = barWidth - 4;
  }

  repositionLoadingUI() {
    const centerX = this.gameWidth / 2;
    const centerY = this.gameHeight / 2;

    const barWidth = this.isMobile ? this.gameWidth * 0.7 : 400;

    const barHeight = this.isMobile ? 18 : 24;

    this.loadingTitle.setPosition(centerX, centerY - 80);

    this.loadingText.setPosition(centerX, centerY - 20);

    this.loadingBarBg.setPosition(centerX, centerY + 30);

    this.loadingBarBg.width = barWidth;
    this.loadingBarBg.height = barHeight;

    this.loadingBar.setPosition(centerX - barWidth / 2, centerY + 30);

    this.loadingPercent.setPosition(centerX, centerY + 70);

    this.loadingBarMaxWidth = barWidth - 4;
  }

  updateLoadingBar(value) {
    const progressWidth = this.loadingBarMaxWidth * value;

    this.loadingBar.width = progressWidth;

    this.loadingPercent.setText(`${Math.round(value * 100)}%`);
  }

  createGraphics() {
    const graphics = this.make.graphics({
      x: 0,
      y: 0,
      add: false,
    });

    this.createParallaxTextures(graphics);

    // Particule jetpack
    graphics.clear();

    graphics.fillStyle(0xff6600, 0.8);

    const particleSize = this.isMobile ? 4 : 6;

    graphics.fillRect(0, 0, particleSize, particleSize);

    graphics.generateTexture("particle", particleSize, particleSize);

    graphics.destroy();
  }

  createParallaxTextures(graphics) {
    const segmentWidth = this.isMobile ? 128 : 256;

    const segmentHeight = this.isMobile ? 90 : 180;

    // SKY
    for (let i = 0; i < 3; i += 1) {
      graphics.clear();

      graphics.fillStyle(0xffffff, 0.25 + i * 0.07);

      for (let c = 0; c < 6 + i; c += 1) {
        const x =
          20 + c * (this.isMobile ? 24 : 38) + Phaser.Math.Between(-10, 10);

        const y = 25 + Phaser.Math.Between(-10, 35);

        graphics.fillCircle(
          x,
          y,
          Phaser.Math.Between(this.isMobile ? 8 : 12, this.isMobile ? 16 : 24),
        );

        graphics.fillCircle(
          x + 18,
          y + Phaser.Math.Between(-3, 6),
          Phaser.Math.Between(this.isMobile ? 6 : 8, this.isMobile ? 12 : 18),
        );
      }

      graphics.generateTexture(
        ASSETS.parallax.sky[i],
        segmentWidth,
        segmentHeight,
      );
    }

    // MOUNTAINS
    for (let i = 0; i < 3; i += 1) {
      graphics.clear();

      const tone = 0x6aa3d6 - i * 0x0b0f11;

      graphics.fillStyle(tone, 0.8);

      let cursorX = 0;

      while (cursorX < segmentWidth + 80) {
        const peakWidth = Phaser.Math.Between(
          this.isMobile ? 40 : 60,
          this.isMobile ? 80 : 110,
        );

        const peakHeight = Phaser.Math.Between(
          this.isMobile ? 20 : 35,
          this.isMobile ? 60 : 85,
        );

        graphics.fillTriangle(
          cursorX,
          segmentHeight,

          cursorX + peakWidth * 0.5,
          segmentHeight - peakHeight,

          cursorX + peakWidth,
          segmentHeight,
        );

        cursorX += peakWidth - 18;
      }

      graphics.generateTexture(
        ASSETS.parallax.mountains[i],
        segmentWidth,
        segmentHeight,
      );
    }

    // CITY
    for (let i = 0; i < 3; i += 1) {
      graphics.clear();

      graphics.fillStyle(0x3d4b73 + i * 0x050505, 0.95);

      let cursorX = 0;

      while (cursorX < segmentWidth) {
        const w = Phaser.Math.Between(
          this.isMobile ? 12 : 20,
          this.isMobile ? 28 : 44,
        );

        const h = Phaser.Math.Between(
          this.isMobile ? 30 : 50,
          this.isMobile ? 80 : 130,
        );

        graphics.fillRect(cursorX, segmentHeight - h, w, h);

        cursorX += w + Phaser.Math.Between(4, 10);
      }

      graphics.generateTexture(
        ASSETS.parallax.city[i],
        segmentWidth,
        segmentHeight,
      );
    }
  }
}
