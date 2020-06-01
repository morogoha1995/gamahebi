import { TILE_SIZE } from "../constants"

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "boot" })
  }

  preload() {
    this.load
      .spritesheet("tiles", "assets/imgs/tiles.png", { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE })
  }

  create() {
    this.scene.start("game")
  }
}
