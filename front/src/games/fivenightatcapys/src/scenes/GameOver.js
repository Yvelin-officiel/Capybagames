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
    const capyImage = this.add
      .image(480, 270, this.monsterKey)
      .setScale(0.1)
      .setAlpha(0);

    this.tweens.add({
      targets: capyImage,
      scale: 0.5,
      alpha: 1,
      duration: 300,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: capyImage,
            alpha: 0,
            duration: 400,
            ease: "Linear",
            onComplete: () => {
              capyImage.destroy();
              this.createGameOverUI("#ff9b9b", "GAME OVER");
            },
          });
        });
      },
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
