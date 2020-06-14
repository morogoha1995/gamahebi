import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE } from "../../constants"
import { Organism } from "../organism"
import { createFontStyle } from "../../utils"

export class Snake extends Organism {
  private speed: number
  private earn: number
  private _isAttack = false
  private isSlow = false

  constructor(scene: Phaser.Scene, col: number, name: SnakeName) {
    super(scene, TILE_SIZE * col + SIDE_BAR_WIDTH + HALF_TILE_SIZE, 0, name, col)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed
    this.earn = sd.earn

    this.setDepth(20)
    this.body.position.set(this.x, 0)
    this.setVelocityY(this.speed)
  }

  get isAttack() {
    return this._isAttack
  }

  update() {
    this.changeVy()
  }

  private changeVy() {
    let newVy = this.speed

    if (this.isAttack)
      newVy = 0
    else if (this.isSlow)
      newVy = this.speed / 2

    this.setVelocityY(newVy)
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

  getGold(): number {
    this.earnTween()
    return this.earn
  }

  private earnTween() {
    const x = this.x,
      y = this.y,
      text = this.scene.add.text(this.x, this.y, `+${this.earn}G`, createFontStyle("orange", 42)),
      scene = this.scene

    text
      .setDepth(49)
      .setScale(0.5)
      .setOrigin(0.5)
      .setRotation(1)

    scene.add.tween({
      targets: text,
      duration: 500,
      y: y - 20,
      scale: 1,
      rotation: 0,
      ease: "cubic",
      onComplete: () => scene.add.tween({
        targets: text,
        duration: 800,
        x: 90,
        y: 50,
        alpha: 0,
        ease: "cubic",
        onComplete: () => text.destroy()
      })
    })
  }
}
