import { HALF_WIDTH, HALF_HEIGHT, HEIGHT, WIDTH } from "../constants"
import { createFontStyle } from "../utils"


export class TitleContainer extends Phaser.GameObjects.Container {
  private _isMute: boolean
  private isClosing = false
  private isBtnPushing = false

  constructor(scene: Phaser.Scene, text: string, color: string, isMute: boolean) {
    super(scene, HALF_WIDTH, HALF_HEIGHT)

    this._isMute = isMute

    const curtain = scene.add.rectangle(0, 0, WIDTH, HEIGHT, 0x606060, 0.3),
      titleY = HALF_HEIGHT / 2,
      title = scene.add
        .text(0, -titleY, text, createFontStyle(color, 3))
        .setOrigin(0.5)

    this.add([
      curtain,
      title
    ])
      .setAlpha(0)

    this.addSoundBtn()

    scene.add.existing(this)
    scene.add.tween({
      targets: this,
      duration: 500,
      alpha: 1
    })
  }

  get isMute(): boolean {
    return this._isMute
  }

  addStartBtn(text: string, fn: Function) {
    const quarterWidth = HALF_WIDTH / 3
    this.addBtn(text, -quarterWidth, 0, "limegreen", "lightgreen", () => {
      if (this.isClosing)
        return

      this.isClosing = true

      this.scene.sound.play("start")

      this.scene.add.tween({
        targets: this,
        duration: 500,
        alpha: 0,
        onComplete: fn,
      })
    })
  }

  private addSoundBtn() {
    const x = HALF_WIDTH / 2,
      y = 0,
      xMark = this.scene.add.image(x, y, "x")
        .setDepth(30)
        .setVisible(this._isMute)

    this.addBtn("音", x, y, "salmon", "darkorange", () => {
      this._isMute = !this._isMute
      xMark.setVisible(this._isMute)
      if (!this._isMute)
        this.scene.sound.play("btn")
    })

    this.add(xMark)
  }

  addTweetBtn(fn: Function) {
    this.addBtn("ツイートする", 0, HALF_HEIGHT / 2, "royalblue", "#00acee", fn)
  }


  private addBtn(text: string, x: number, y: number, color: string, bgColor: string, fn: Function) {
    const btn = this.scene.add.text(x, y, text, createFontStyle(color, 2))
      .setOrigin(0.5)
      .setPadding(6, 6, 6, 6)
      .setBackgroundColor(bgColor)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.isBtnPushing || this.isClosing)
          return

        this.isBtnPushing = true

        this.scene.add.tween({
          targets: btn,
          duration: 50,
          scale: 0.9,
          yoyo: true,
          onComplete: () => {
            this.isBtnPushing = false
            fn()
          }
        })
      })

    this.add(btn)
  }
}
