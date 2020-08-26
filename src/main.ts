import Phaser from "phaser"
import { WIDTH, HEIGHT } from "./constants"
import { Boot } from "./scenes/boot"
import { Game } from "./scenes/game"
import { End } from "./scenes/end"

window.onload = () => {
  new Phaser.Game({
    parent: 'app',
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
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
      End
    ]
  })
}
