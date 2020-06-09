import { FrogName } from "../../../types/frog"
import FrogDatas from "../../datas/frog.json"

export class Frog extends Phaser.Physics.Arcade.Image {
  name: FrogName
  private jaName: string
  private hp: number
  private atk: number
  private price: number
  private interval: number
  private basePos: any

  private grade = 1
  private nextAttack = 0

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName) {
    super(scene, x, y, name)

    const fd = FrogDatas[name]
    this.jaName = fd.jaName
    this.hp = fd.hp
    this.atk = fd.atk
    this.price = fd.price
    this.interval = fd.interval
    this.name = name
    this.setDepth(10)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    console.log(this.x, this.body.x, this.body.center)
  }

  canAttack(): boolean {
    return this.nextAttack <= this.scene.time.now
  }

  private calcNextAttack() {
    this.nextAttack = this.scene.time.now + this.interval
  }

  attack() {
    this.calcNextAttack()
  }
}
