class Snake extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key)

    scene.add.existing(this)
  }
}
