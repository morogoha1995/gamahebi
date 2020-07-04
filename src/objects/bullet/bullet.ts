import BulletDatas from "../../datas/bullet.json"
import { ShootableName } from "../../../types/frog"

export class Bullet extends Phaser.Physics.Arcade.Image {
  readonly speed: number
  private _inDieAnims = false
  readonly atk: number

  constructor(scene: Phaser.Scene, x: number, y: number, name: ShootableName, atk: number) {
    super(scene, x, y, `${name}Bullet`)

    const bd = BulletDatas[name]

    this.speed = bd.speed
    this.name = name
    this.atk = atk

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
