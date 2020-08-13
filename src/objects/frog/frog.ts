import { FrogName } from "../../../types/frog"
import FrogDatas from "../../datas/frog.json"
import { Organism } from "../organism"

export class Frog extends Organism {
  name: FrogName
  private readonly jaName: string
  private readonly maxHp: number
  private _atk: number
  private price: number
  private interval: number
  private readonly _row: number

  private grade = 1
  private nextAttack = 0

  constructor(scene: Phaser.Scene, x: number, y: number, name: FrogName, row: number, col: number) {
    super(scene, x, y - 30, name, col)

    const fd = FrogDatas[name]
    this.jaName = fd.jaName
    this._hp = fd.hp
    this.maxHp = fd.hp
    this._atk = fd.atk
    this.price = fd.price
    this.interval = fd.interval
    this.name = name
    this._row = row
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

  get row(): number {
    return this._row
  }

  get nameInfo(): string {
    return this.grade === 1 ? this.jaName : `${this.jaName} +${this.grade - 1}`
  }

  get hpInfo(): string {
    return `HP:${this._hp}/${this.maxHp}`
  }

  get upgradePrice(): number {
    return this.calcUpgradePrice()
  }

  get sellPrice(): number {
    return this.calcSellPrice()
  }

  canAttack(snakeCol: number): boolean {
    return snakeCol === this.col && this.nextAttack <= this.scene.time.now && this.active
  }

  protected calcNextAttack() {
    this.nextAttack = this.scene.time.now + this.interval
  }

  upgrade() {
    this.changeGoldTween(`-${this.price}G`, "crimson")
    this.grade++
    this.price = this.upgradePrice
    this._atk += this._atk
  }

  private calcUpgradePrice(): number {
    return this.price * this.grade
  }

  sell() {
    this.changeGoldTween(`+${this.price}G`, "orange")
    this.destroy()
  }

  private calcSellPrice(): number {
    return Math.floor(this.price / 2)
  }

  attack(bulletGroup: Phaser.GameObjects.Group) {
    // override plz.
  }
}
