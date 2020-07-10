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
  private slowImg: Phaser.GameObjects.Image
  private moveTween: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, col: number, name: SnakeName) {
    super(scene, TILE_SIZE * col + SIDE_BAR_WIDTH + HALF_TILE_SIZE, 0, name, col)

    const sd = SnakeDatas[name]
    this._hp = sd.hp
    this.speed = sd.speed
    this.earn = sd.earn
    this.slowImg = scene.add.image(this.x, this.y, "ice")
      //.setDepth(21)
      .setScale(0.8)
      .setVisible(false)

    this.setScale(0.9, 1)
    //.setDepth(20)
    this.moveTween = scene.add.tween({
      targets: this,
      duration: 500,
      scaleX: 1,
      scaleY: 0.75,
      ease: "Power2",
      yoyo: true,
      repeat: -1
    })

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

    if (this.isSlow && this.slowImg.visible)
      this.slowImg.setY(this.y)
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
    this.moveTween.stop(0)
    this.attackTween()
    this.scene.time.delayedCall(1000, () => {
      this._isAttack = false
      this.moveTween.restart()
    })
  }

  private attackTween() {
    this.scene.add.tween({
      targets: this,
      duration: 200,
      y: this.y + 20,
      //scale: 1.2,
      ease: "Power3",
      yoyo: true
    })
  }

  damaged(atk: number, name: string) {
    super.damaged(atk, name)

    if (name === "frozen")
      this.toSlow()

    if (this.isDead && this.slowImg.visible)
      this.slowImg.setVisible(false)
  }

  private toSlow() {
    if (this.isSlow || this.isDead)
      return

    this.isSlow = true
    this.slowImg.setVisible(true)
    this.scene.time.delayedCall(3000, () => this.recoverFromSlow())
  }

  private recoverFromSlow() {
    if (this.isDead)
      return

    this.isSlow = false
    this.slowImg.setVisible(false)
  }

  getGold(): number {
    this.earnTween()
    return this.earn
  }

  private earnTween() {
    this.changeGoldTween(`+${this.earn}G`, "orange")
  }
}
