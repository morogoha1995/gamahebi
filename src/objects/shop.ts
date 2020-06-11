import frogDatas from "../datas/frog.json"
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
      padding = 6,
      fontSize = 36,
      textX = imgSize + padding,
      priceTextY = halfHeight

    let y = 0

    for (const key in fds) {
      const fd = fds[key],

        img = scene.add.image(padding, halfHeight, key).setDisplaySize(imgSize, imgSize).setOrigin(0, 0.5),

        priceText = scene.add.text(textX, priceTextY, `${fd.price}G`, createFontStyle("orange", fontSize)).setOrigin(0, 0.5),

        zone = scene.add.zone(0, 0, SIDE_BAR_WIDTH, height).setOrigin(0, 0).setInteractive(),

        container = scene.add.container(0, y, [img, priceText, zone])

      this.frogs[key] = {
        container: container,
        zone: zone
      }
      y += height + padding
    }
  }

  getFrogs(): Frogs {
    return this.frogs
  }
}
