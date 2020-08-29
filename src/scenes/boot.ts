import { TILE_SIZE } from "../constants"

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "boot" })
  }

  preload() {
    this.load
      .image("x", "assets/imgs/x.png")
      .image("pistol", "assets/imgs/frog/pistol.png")
      .image("rapid", "assets/imgs/frog/rapid.png")
      .image("frozen", "assets/imgs/frog/frozen.png")
      .image("shield", "assets/imgs/frog/shield.png")
      .image("pistolBullet", "assets/imgs/frog/bullet/pistol.png")
      .image("frozenBullet", "assets/imgs/frog/bullet/frozen.png")
      .image("normalSnake", "assets/imgs/snake/normal-snake.png")
      .image("thinSnake", "assets/imgs/snake/thin-snake.png")
      .image("ultSnake", "assets/imgs/snake/ult-snake.png")
      .image("ice", "assets/imgs/ice.png")
      .image("hole", "assets/imgs/hole.png")
      .image("pond", "assets/imgs/pond.png")
      .spritesheet("tiles", "assets/imgs/tiles.png", { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE })
      .audio("start", "assets/audios/start.mp3")
      .audio("attack", "assets/audios/attack.mp3")
      .audio("btn", "assets/audios/btn.mp3")
      .audio("buy", "assets/audios/buy.mp3")
      .audio("earn", "assets/audios/earn.mp3")
      .audio("wave", "assets/audios/wave.mp3")
      .audio("dead", "assets/audios/dead.mp3")
      .audio("notEnough", "assets/audios/not_enough.mp3")
      .audio("outside", "assets/audios/outside.mp3")
  }

  create() {
    this.scene.start("game")
  }
}
