import BulletDatas from "../../datas/bullet.json"
import { FrogName } from "../../../types/frog"

export class Bullet extends Phaser.Physics.Arcade.Image {
  private speed: number
  private isDying = false

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName) {
    super(scene, x, y, `${name}Bullet`)

    const bd = BulletDatas[name]

    this.speed = bd.speed

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.position.set(x, y)
    this.setVelocityY(-this.speed)
  }

  die() {
    this.dieAnims()
  }

  getIsDying(): boolean {
    return this.isDying
  }

  private dieAnims() {
    if (this.isDying)
      return

    this.isDying = true
    this.setVelocityY(0)

    this.scene.add.tween({
      targets: this,
      duration: 100,
      scale: 2,
      alpha: 0,
      onComplete: () => this.destroy()
    })
  }
}
