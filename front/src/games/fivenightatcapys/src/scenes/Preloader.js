import ASSETS from "../assets.js";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image(ASSETS.monsters.capyGamer, ASSETS.paths.capyGamer);
    this.load.image(ASSETS.monsters.capyLove, ASSETS.paths.capyLove);
    this.load.image(ASSETS.monsters.capyWizard, ASSETS.paths.capyWizard);

    // Load camera images
    this.load.image(ASSETS.cameras.cam1, ASSETS.paths.cam1);
    this.load.image(ASSETS.cameras.cam2, ASSETS.paths.cam2);
    this.load.image(ASSETS.cameras.cam3, ASSETS.paths.cam3);
    this.load.image(ASSETS.cameras.caml, ASSETS.paths.caml);
    this.load.image(ASSETS.cameras.camr, ASSETS.paths.camr);
  }

  create() {
    this.scene.start("Game");
  }
}
