import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: "game-container",
  backgroundColor: "#05070b",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, Game, GameOver],
};

new Phaser.Game(config);
