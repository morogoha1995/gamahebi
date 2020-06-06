import BulletDatas from "../../datas/bullet.json"
import { FrogName } from "../../../types/frog"


export class Bullet extends Phaser.GameObjects.Image {
  private speed: number

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName) {
    super(scene, x, y, `${name}Bullet`)

    const bd = BulletDatas[name]

    //this.setOrigin(0.25)
    this.speed = bd.speed

    scene.add.existing(this)
  }

  update() {
    this.y -= this.speed
  }
}
