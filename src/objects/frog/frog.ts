export class Frog extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key)

    this.setDepth(10)
    scene.add.existing(this)
  }
}
