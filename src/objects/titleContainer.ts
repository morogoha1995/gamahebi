import { HALF_WIDTH, HALF_HEIGHT } from "../constants"
import { createFontStyle } from "../utils"


export class TitleContainer extends Phaser.GameObjects.Container {
  private isMute: boolean

  constructor(scene: Phaser.Scene, text: string, color: string, isMute: boolean) {
    super(scene, HALF_WIDTH, HALF_HEIGHT)

    this.isMute = isMute

    this
      .add(
        scene.add
          .text(0, -120, text, createFontStyle(color, 48))
          .setOrigin(0.5)
      )
      .setAlpha(0)
    this.addSoundBtn()

    scene.add.existing(this)
    scene.add.tween({
      targets: this,
      duration: 500,
      alpha: 1
    })
  }

  getIsMute(): boolean {
    return this.isMute
  }

  addStartBtn(text: string): Phaser.GameObjects.Text {
    const quarterWidth = HALF_WIDTH / 3
    return this.addBtn(text, -quarterWidth, -20, "limegreen", "lightgreen")
  }

  private addSoundBtn(): Phaser.GameObjects.Text {
    const x = HALF_WIDTH / 2
    const y = -20

    const soundBtn = this.addBtn("音", x, y, "salmon", "darkorange")

    const xMark = this.scene.add.image(x, y, "x")
      .setDepth(30)
      .setVisible(this.isMute)
    this.add(xMark)

    return soundBtn.on("pointerdown", () => {
      this.isMute = !this.isMute
      xMark.setVisible(this.isMute)
      if (!this.isMute)
        this.scene.sound.play("buy")
    })
  }

  addTweetBtn(): Phaser.GameObjects.Text {
    return this.addBtn("ツイートする", 0, 80, "royalblue", "#00acee")
  }


  private addBtn(text: string, x: number, y: number, color: string, bgColor: string): Phaser.GameObjects.Text {
    const btn = this.scene.add.text(x, y, text, createFontStyle(color, 30))
      .setOrigin(0.5)
      .setPadding(6, 6, 6, 6)
      .setBackgroundColor(bgColor)
      .setInteractive()

    this.add(btn)

    return btn
  }
}
