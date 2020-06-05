import BulletDatas from "../../datas/bullet.json"
import { FrogName } from "../../../types/frog"


export class Bullet extends Phaser.GameObjects.Image {
  body!: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName) {
    super(scene, x, y, `${name}Bullet`)

    const bd = BulletDatas[name]

    this.setOrigin(0.25)

    scene.add.existing(this)
    scene.physics.world.enable(this)

    this.body.setVelocityY(-bd.speed)
  }
}
