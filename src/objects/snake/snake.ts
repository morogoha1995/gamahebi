import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE, HEIGHT } from "../../constants"
import { Organism } from "../organism"

export class Snake extends Organism {
  private speed: number
  private earn: number
  private _isAttack = false
  private isSlow = false
  private _isTouchBottom = false

  constructor(scene: Phaser.Scene, col: number, name: SnakeName) {
    super(scene, TILE_SIZE * col + SIDE_BAR_WIDTH + HALF_TILE_SIZE, 0, name, col)

    const sd = SnakeDatas[name]
    this._hp = sd.hp
    this.speed = sd.speed
    this.earn = sd.earn

    this.setDepth(20)
    this.body.position.set(this.x, 0)
    this.setVelocityY(this.speed)
  }

  get isAttack(): boolean {
    return this._isAttack
  }

  get isTouchBottom(): boolean {
    return this._isTouchBottom
  }

  update() {
    this.changeVy()
    this.checkTouchBottom()
  }

  private changeVy() {
    let newVy = this.speed

    if (this.isAttack)
      newVy = 0
    else if (this.isSlow)
      newVy = this.speed / 3

    this.setVelocityY(newVy)
  }

  private checkTouchBottom() {
    this._isTouchBottom = this.y >= HEIGHT
  }

  attack() {
    if (this.isAttack)
      return

    this._isAttack = true
    this.attackTween()
    this.scene.time.delayedCall(1000, () => this._isAttack = false)
  }

  private attackTween() {
    this.scene.add.tween({
      targets: this,
      duration: 200,
      y: this.y + 20,
      scale: 1.2,
      yoyo: true
    })
  }

  damaged(atk: number, name: string) {
    super.damaged(atk, name)

    if (name === "frozen")
      this.toSlow()
  }

  private toSlow() {
    if (this.isSlow)
      return

    this.isSlow = true

    this.scene.time.delayedCall(3000, () => this.isSlow = false)
  }

  getGold(): number {
    this.earnTween()
    return this.earn
  }

  private earnTween() {
    this.changeGoldTween(`+${this.earn}G`, "orange")
  }
}
