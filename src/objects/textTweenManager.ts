import { HALF_WIDTH, HALF_HEIGHT } from "../constants"
import { createFontStyle } from "../utils"

export class TextTweenManager {
  private readonly scene: Phaser.Scene
  private isAnims = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  do(text: string, fn?: Function) {
    if (this.isAnims)
      return

    this.isAnims = true

    const t = this.scene.add.text(HALF_WIDTH, HALF_HEIGHT - 30, text, createFontStyle("#202020", 2))
      .setOrigin(0.5)
      .setAngle(-5)
      .setDepth(51)

    this.scene.add.tween({
      targets: t,
      duration: 300,
      angle: 5,
      yoyo: true,
      onComplete: () => {
        this.isAnims = false
        t.destroy()
        if (fn)
          fn()
      }
    })
  }
}
