import Phaser from "phaser"
import { WIDTH, HEIGHT } from "./constants"
import { Boot } from "./scenes/boot"
import { Game } from "./scenes/game"
import { Menu } from "./scenes/menu"
import { End } from "./scenes/end"

window.onload = () => {
  new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'app',
    scale: {
      mode: Phaser.Scale.FIT,
      max: {
        width: WIDTH,
        height: HEIGHT
      }
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      }
    },
    backgroundColor: "#4DB6AC",
    scene: [
      Boot,
      Game,
      End,
      Menu
    ]
  })
}
