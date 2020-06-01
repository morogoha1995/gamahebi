import { TILE_SIZE } from "../constants"

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "boot" })
  }

  preload() {
    this.load
      .spritesheet("tiles", "assets/imgs/tiles.png", { frameWidth: 64, frameHeight: 64 })
  }

  create() {
    this.scene.start("game")
  }
}
