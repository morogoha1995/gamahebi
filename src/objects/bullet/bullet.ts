import BulletDatas from "../../datas/bullet.json"
import { FrogName } from "../../../types/frog"

export class Bullet extends Phaser.Physics.Arcade.Image {
  private speed: number
  private _inDieAnims = false

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName) {
    super(scene, x, y, `${name}Bullet`)

    const bd = BulletDatas[name]

    this.speed = bd.speed
    this.name = name

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.position.set(x, y)
    this.setVelocityY(-this.speed)
  }

  die() {
    this.dieAnims()
  }

  get isDying(): boolean {
    return this._inDieAnims
  }

  private dieAnims() {
    if (this._inDieAnims)
      return

    this._inDieAnims = true
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
