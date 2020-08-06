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
  }

  create() {
    this.scene.start("game")
  }
}
