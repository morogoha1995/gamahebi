export class Frog extends Phaser.GameObjects.Image {
  private bullet!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
    super(scene, x, y, name)

    this.setDepth(10)
    this.bullet = scene.add.image(x, y, `${name}Bullet`)

    scene.physics.world.enable(this.bullet)
    scene.add.existing(this)
  }
}
