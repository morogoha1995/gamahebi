import { OrganismName } from "../../types/organism"
import { createFontStyle } from "../utils"

export class Organism extends Phaser.Physics.Arcade.Image {
  protected _hp = 0
  readonly col: number
  private inDamagedTween = false

  constructor(scene: Phaser.Scene, x: number, y: number, name: OrganismName, col: number) {
    super(scene, x, y, name)

    this.col = col

    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  get hp(): number {
    return this._hp
  }


  damaged(atk: number, name: string) {
    this._hp -= atk

    if (this.isDead)
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

  get isDead(): boolean {
    return this._hp <= 0
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

  protected changeGoldTween(text: string, color: string) {
    const scene = this.scene,
      t = scene.add.text(this.x, this.y, text, createFontStyle(color, 2))

    t
      .setDepth(49)
      .setScale(0.5)
      .setOrigin(0.5)
      .setRotation(1)

    scene.add.tween({
      targets: t,
      duration: 500,
      y: this.y - 20,
      scale: 1,
      rotation: 0,
      ease: "cubic",
      onComplete: () => scene.add.tween({
        targets: t,
        duration: 800,
        x: 90,
        y: 50,
        alpha: 0,
        ease: "cubic",
        onComplete: () => t.destroy()
      })
    })
  }
}
