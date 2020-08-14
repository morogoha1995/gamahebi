import { FrogName } from "../../../types/frog"
import FrogDatas from "../../datas/frog.json"
import { Organism } from "../organism"

export class Frog extends Organism {
  name: FrogName
  private readonly jaName: string
  private readonly maxHp: number
  private readonly baseAtk: number
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
    this._hp = this.maxHp = fd.hp
    this.baseAtk = this._atk = fd.atk
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

  get nameInfo(): string {
    return this.grade === 1 ? this.jaName : `${this.jaName} +${this.grade - 1}`
  }

  get hpInfo(): string {
    return `HP:${this._hp}/${this.maxHp}`
  }

  get upgradePrice(): number {
    return this.price * this.grade
  }

  get sellPrice(): number {
    return Math.floor(this.price / 2)
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
    this._atk += this.baseAtk
  }

  sell() {
    this.changeGoldTween(`+${this.sellPrice}G`, "orange")
    this.destroy()
  }

  attack(bulletGroup: Phaser.GameObjects.Group) {
    // override plz.
  }
}
