import Phaser from "phaser"
import { WIDTH, HEIGHT } from "./constants"
import { determineZoom } from "./utils"
import { Boot } from "./scenes/boot"
import { Game } from "./scenes/game"

window.onload = () => {
  const zoom = determineZoom(window.innerWidth, window.innerHeight)

  new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'app',
    zoom: zoom,
    physics: {
      default: "arcade"
    },
    backgroundColor: "#4DB6AC",
    scene: [
      Boot,
      Game,
    ]
  })
}
