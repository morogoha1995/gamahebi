import frogDatas from "../datas/frog/base.json"
import { Frogs } from "../../types/frog"
import { SIDE_BAR_WIDTH } from "../constants"
import { createFontStyle } from "../utils"

export class Shop {
  private gold = 50
  private frogs: Frogs = {}

  constructor(scene: Phaser.Scene) {
    // 武器一覧の表示
    const fds: any = frogDatas,
      height = 100,
      halfHeight = height / 2,
      imgSize = 70,
      padding = 10,
      textX = imgSize + padding,
      nameTextY = halfHeight - 10,
      priceTextY = halfHeight + 10

    let y = 0

    for (const key in fds) {
      const fd = fds[key],

        img = scene.add.image(padding, halfHeight, key).setDisplaySize(imgSize, imgSize).setOrigin(0, 0.5),

        text = scene.add.text(textX, nameTextY, fd.jaName, createFontStyle("#333333", 20)).setOrigin(0, 0.5),

        priceText = scene.add.text(textX, priceTextY, `${fd.price}G`, createFontStyle("#333333", 20)).setOrigin(0, 0.5),

        container = scene.add.container(0, y, [img, text, priceText])
          .setSize(SIDE_BAR_WIDTH, height)
          .setInteractive()

      this.frogs[key] = container
      y += height + padding
    }
  }

  getFrogs(): Frogs {
    return this.frogs
  }
}
