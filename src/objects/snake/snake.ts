import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE } from "../../constants"
import { Organism } from "../organism"

export class Snake extends Organism {
  private speed: number
  private _isAtk = false
  private isSlow = false

  constructor(scene: Phaser.Scene, col: number, name: SnakeName) {
    super(scene, TILE_SIZE * col + SIDE_BAR_WIDTH + HALF_TILE_SIZE, 0, name, col)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed

    this.setDepth(20)
    this.body.position.set(this.x, 0)
    this.setVelocityY(this.speed)
  }

  get isAtk() {
    return this._isAtk
  }

  update() {
    this.changeVy()
  }

  private changeVy() {
    let newVy = this.speed

    if (this.isAtk)
      newVy = 0
    else if (this.isSlow)
      newVy = this.speed / 2

    this.setVelocityY(newVy)
  }

  atk() {
    if (this.isAtk)
      return

    this._isAtk = true
    this.atkTween()
  }

  private atkTween() {
    this.scene.time.delayedCall(1000, () => this._isAtk = false)

    this.scene.add.tween({
      targets: this,
      duration: 200,
      y: this.y + 20,
      scale: 1.2,
      yoyo: true
    })
  }
}
