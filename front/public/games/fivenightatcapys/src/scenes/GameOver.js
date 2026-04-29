export class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    this.won = Boolean(data.won);
    this.reason = data.reason || "";
    this.hour = data.hour || "12 AM";
    this.power = data.power ?? 0;
    this.monsterKey = data.monsterKey || null;
  }

  create() {
    const mainColor = this.won ? "#92f5a6" : "#ff9b9b";
    const title = this.won ? "6 AM !" : "GAME OVER";

    this.add.rectangle(480, 270, 960, 540, 0x05070b);

    if (!this.won && this.monsterKey) {
      this.createJumpscare();
    } else {
      this.createGameOverUI(mainColor, title);
    }
  }

  createJumpscare() {
    // Add screen shake effect early
    this.cameras.main.shake(600, 0.02);

    // Create glitch bars (scan lines effect)
    const glitchBars = [];
    for (let i = 0; i < 8; i++) {
      const bar = this.add.rectangle(
        480,
        Phaser.Math.Between(50, 500),
        960,
        Phaser.Math.Between(20, 60),
        0x000000,
        0.5,
      );
      glitchBars.push(bar);
    }

    // Create multiple glitch layers for visual distortion
    const glitchLayers = [];
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;
      const glitchImage = this.add
        .image(480 + offsetX, 270 + offsetY, this.monsterKey)
        .setScale(0.5 + Math.random() * 0.12)
        .setAlpha(0.2 + Math.random() * 0.4)
        .setTint(0xff0000 + Math.random() * 0x00ff00);
      glitchLayers.push(glitchImage);
    }

    // Main capy image
    const capyImage = this.add
      .image(480, 270, this.monsterKey)
      .setScale(0.1)
      .setAlpha(0)
      .setDepth(100);

    // White flash overlay
    const whiteFlash = this.add
      .rectangle(480, 270, 960, 540, 0xffffff)
      .setAlpha(0)
      .setDepth(50);

    // Red tint overlay
    const redTint = this.add
      .rectangle(480, 270, 960, 540, 0xff0000)
      .setAlpha(0)
      .setDepth(49);

    // Animate the main capy
    this.tweens.add({
      targets: capyImage,
      scale: 0.58,
      alpha: 1,
      duration: 80,
      ease: "Quad.easeOut",
    });

    // Multiple white flashes
    for (let flash = 0; flash < 3; flash++) {
      this.time.delayedCall(flash * 100, () => {
        this.tweens.add({
          targets: whiteFlash,
          alpha: 0.9,
          duration: 40,
          ease: "Linear",
          yoyo: true,
          hold: 10,
        });
      });
    }

    // Red tint pulse
    this.tweens.add({
      targets: redTint,
      alpha: 0.3,
      duration: 150,
      ease: "Linear",
      yoyo: true,
      repeat: 2,
    });

    // Glitch animation loop - distorted repositioning
    let glitchCount = 0;
    const glitchEvent = this.time.addEvent({
      delay: 25,
      callback: () => {
        glitchCount++;

        // Randomly update glitch layers
        glitchLayers.forEach((layer, index) => {
          if (Math.random() > 0.6) {
            layer.setPosition(
              480 + (Math.random() - 0.5) * 100,
              270 + (Math.random() - 0.5) * 100,
            );
            layer.setAlpha(0.15 + Math.random() * 0.5);
            layer.setTint(
              0xff0000 * Math.random() +
                0x00ff00 * Math.random() +
                0x0000ff * Math.random(),
            );
          }
        });

        // Update glitch bars
        glitchBars.forEach((bar) => {
          if (Math.random() > 0.7) {
            bar.setPosition(480, Phaser.Math.Between(50, 500));
            bar.setAlpha(0.3 + Math.random() * 0.5);
            bar.setDisplaySize(
              960 + Math.random() * 100,
              Phaser.Math.Between(15, 80),
            );
          }
        });

        if (glitchCount > 20) {
          glitchEvent.remove();
          glitchLayers.forEach((layer) => {
            if (layer && !layer.isDestroyed) {
              layer.destroy();
            }
          });
          glitchBars.forEach((bar) => {
            if (bar && !bar.isDestroyed) {
              bar.destroy();
            }
          });
        }
      },
      loop: true,
    });

    // Cleanup and show game over screen
    this.time.delayedCall(600, () => {
      glitchEvent.remove();

      glitchLayers.forEach((layer) => {
        if (layer && !layer.isDestroyed) {
          layer.destroy();
        }
      });
      glitchBars.forEach((bar) => {
        if (bar && !bar.isDestroyed) {
          bar.destroy();
        }
      });
      capyImage.destroy();
      whiteFlash.destroy();
      redTint.destroy();

      this.createGameOverUI("#ff9b9b", "GAME OVER");
    });
  }

  createGameOverUI(mainColor, title) {
    this.add
      .rectangle(480, 270, 700, 360, 0x121827)
      .setStrokeStyle(3, 0x334362);

    this.add
      .text(480, 165, title, {
        fontSize: "64px",
        color: mainColor,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 245, this.reason, {
        fontSize: "28px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 620 },
      })
      .setOrigin(0.5);

    this.add
      .text(
        480,
        305,
        `Heure atteinte: ${this.hour} • Power restante: ${this.power}%`,
        {
          fontSize: "22px",
          color: "#d6def3",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(480, 390, "Clique pour recommencer", {
        fontSize: "24px",
        color: "#f4dc8a",
        backgroundColor: "#25334f",
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("Game"));

    this.input.keyboard.on("keydown-SPACE", () => this.scene.start("Game"));
    this.input.keyboard.on("keydown-ENTER", () => this.scene.start("Game"));
  }
}
