import BulletDatas from "../../datas/bullet.json"
import { FrogName } from "../../../types/frog"

export class Bullet extends Phaser.Physics.Arcade.Image {
  private speed: number

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName) {
    super(scene, x, y, `${name}Bullet`)

    const bd = BulletDatas[name]

    this.speed = bd.speed

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.position.set(x, y)
    this.setVelocityY(-this.speed)
  }
}
