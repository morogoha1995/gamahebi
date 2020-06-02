class Snake extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, key: string) {
    super(scene, x, 0, key)

    scene.add.existing(this)
  }
}
