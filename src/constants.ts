import { createFontStyle } from "./utils"

export const WIDTH = 640,
  HALF_WIDTH = WIDTH / 2,
  HEIGHT = 672,
  HALF_HEIGHT = HEIGHT / 2,
  TILE_SIZE = 96,
  HALF_TILE_SIZE = TILE_SIZE / 2,
  SIDE_BAR_WIDTH = 160,
  FONT_SIZE = 24,
  notEnoughTween = (scene: Phaser.Scene, fn?: Function) => {
    const t = scene.add.text(HALF_WIDTH, HALF_HEIGHT - 30, "ゴールドが足りません", createFontStyle("#202020", 2))
      .setOrigin(0.5)
      .setAngle(-5)
      .setDepth(51)

    scene.add.tween({
      targets: t,
      duration: 300,
      angle: 5,
      yoyo: true,
      onComplete: () => {
        t.destroy()
        if (fn)
          fn()
      }
    })
  }
