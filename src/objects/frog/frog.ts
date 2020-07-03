import { FrogName } from "../../../types/frog"
import FrogDatas from "../../datas/frog.json"
import { Organism } from "../organism"

export class Frog extends Organism {
  name: FrogName
  readonly jaName: string
  private _atk: number
  private price: number
  private interval: number
  readonly row: number

  private grade = 1
  private nextAttack = 0

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName, row: number, col: number) {
    super(scene, x, y - 30, name, col)

    const fd = FrogDatas[name]
    this.jaName = fd.jaName
    this.hp = fd.hp
    this._atk = fd.atk
    this.price = fd.price
    this.interval = fd.interval
    this.name = name
    this.row = row
    this
      .setDepth(10)
      .setActive(false)
      .setInteractive()

    scene.add.tween({
      targets: this,
      duration: 300,
      y: y,
      ease: "bounce",
      onComplete: () => this.setActive(true)
    })

    this.changeGoldTween(`-${this.price}G`, "crimson")
  }

  get atk(): number {
    return this._atk
  }

  canAttack(snakeCol: number): boolean {
    return snakeCol === this.col && this.nextAttack <= this.scene.time.now && this.active
  }

  protected calcNextAttack() {
    this.nextAttack = this.scene.time.now + this.interval
  }

  getInfoName(): string {
    return this.grade === 1 ? this.jaName : `${this.jaName} +${this.grade}`
  }

  upgrade() {
    this.changeGoldTween(`-${this.price}G`, "crimson")
    this.grade++
    this.price = this.upgradePrice
    this._atk *= this.grade
  }

  get upgradePrice(): number {
    return this.calcUpgradePrice()
  }

  private calcUpgradePrice(): number {
    return this.price * this.grade
  }

  sell() {
    this.changeGoldTween(`+${this.price}G`, "orange")
    this.destroy()
  }

  get sellPrice(): number {
    return this.calcSellPrice()
  }

  private calcSellPrice(): number {
    return Math.floor(this.price / 2)
  }

  attack(bulletGroup: Phaser.GameObjects.Group) {
    // override plz.
  }
}
