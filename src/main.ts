import Phaser from "phaser"
import { WIDTH, HEIGHT } from "./constants"
import { determineZoom } from "./utils"
import { Boot } from "./scenes/boot"
import { Game } from "./scenes/game"
import { Menu } from "./scenes/menu"
import { End } from "./scenes/end"

window.onload = () => {
  const zoom = determineZoom(window.innerWidth, window.innerHeight)

  new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'app',
    zoom: zoom,
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
