export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "boot" })
  }

  create() {
    this.scene.start("game")
  }
}
