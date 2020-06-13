import frogDatas from "../datas/frog.json"
import { Frogs } from "../../types/frog"
import { SIDE_BAR_WIDTH } from "../constants"
import { createFontStyle } from "../utils"

export class Shop {
  private gold = 50
  private frogs: Frogs = {}
  private goldText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    const fds: any = frogDatas,
      height = 100,
      halfHeight = height / 2,
      imgSize = 70,
      padding = 6,
      fontSize = 28,
      textX = imgSize + padding,
      textY = halfHeight

    let y = 0

    // 所持金の表示
    scene.add.text(padding, textY, "所持金:", createFontStyle("black", 20)).setOrigin(0, 0.5)
    this.goldText = scene.add.text(90, textY, "0G", createFontStyle("orange", fontSize)).setOrigin(0, 0.5)
    y += height + padding

    // 武器一覧の表示
    for (const key in fds) {
      const fd = fds[key],
        img = scene.add.image(padding, halfHeight, key).setDisplaySize(imgSize, imgSize).setOrigin(0, 0.5),
        priceText = scene.add.text(textX, textY, `${fd.price}G`, createFontStyle("orange", fontSize)).setOrigin(0, 0.5),
        zone = scene.add.zone(0, 0, SIDE_BAR_WIDTH, height).setOrigin(0, 0).setInteractive(),
        container = scene.add.container(0, y, [img, priceText, zone])

      this.frogs[key] = {
        container: container,
        zone: zone
      }
      y += height + padding
    }

  }

  setGoldText(value: number) {
    this.goldText.setText(`${value}G`)
  }

  getFrogs(): Frogs {
    return this.frogs
  }
}
