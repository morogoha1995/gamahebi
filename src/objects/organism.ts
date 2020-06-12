import { OrganismName } from "../../types/organism"

export class Organism extends Phaser.Physics.Arcade.Image {
  protected hp = 0
  readonly col: number
  private inDamagedTween = false

  constructor(scene: Phaser.Scene, x: number, y: number, name: OrganismName, col: number) {
    super(scene, x, y, name)

    this.col = col

    scene.add.existing(this)
    scene.physics.add.existing(this)
  }


  damaged(atk: number) {
    this.hp -= atk

    if (this.isDead())
      this.die()
    else
      this.damagedTween()
  }

  private damagedTween() {
    if (this.inDamagedTween)
      return

    this.inDamagedTween = true

    this.scene.add.tween({
      targets: this,
      duration: 140,
      alpha: 0.4,
      repeat: 2,
      yoyo: true,
      onComplete: () => this.inDamagedTween = false
    })
  }

  private isDead(): boolean {
    return this.hp <= 0
  }

  private die() {
    this.setActive(false)

    this.scene.add.tween({
      targets: this,
      duration: 450,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 0.2,
      y: this.y + 20,
      onComplete: () => this.destroy()
    })
  }
}
