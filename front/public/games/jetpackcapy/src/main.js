import { Boot } from "./scenes/Boot.js";
import { Preloader } from "./scenes/Preloader.js";
import { Start } from "./scenes/Start.js";
import { Game } from "./scenes/Game.js";
import { GameOver } from "./scenes/GameOver.js";

const config = {
  type: Phaser.AUTO,

  parent: "game-container",

  backgroundColor: "#87CEEB",

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },

  scene: [Boot, Preloader, Start, Game, GameOver],
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
