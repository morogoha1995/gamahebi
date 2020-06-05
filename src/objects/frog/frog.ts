import { Bullet } from "../bullet/bullet"
import { FrogName } from "../../../types/frog"
import FrogDatas from "../../datas/frog.json"

export class Frog extends Phaser.GameObjects.Image {
  name: FrogName
  body!: Phaser.Physics.Arcade.Body
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
    scene.physics.world.enable(this)
  }

  canAttack(): boolean {
    return this.nextAttack <= this.scene.time.now
  }

  private calcNextAttack() {
    this.nextAttack = this.scene.time.now + this.interval
  }

  attack(): Bullet {
    const b = new Bullet(this.scene, this.x, this.y, this.name)
    this.calcNextAttack()
    return b
  }
}
