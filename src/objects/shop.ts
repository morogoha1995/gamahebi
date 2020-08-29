import frogDatas from "../datas/frog.json"
import { Frogs, FrogName } from "../../types/frog"
import { SIDE_BAR_WIDTH } from "../constants"
import { createFontStyle } from "../utils"
import { TextTweenManager } from "./textTweenManager"

export class Shop {
  private gold = 30
  private frogs: Frogs = {}
  private goldText: Phaser.GameObjects.Text
  private textTweenManager: TextTweenManager

  constructor(scene: Phaser.Scene) {
    const fds: any = frogDatas,
      height = 100,
      halfHeight = height / 2,
      imgSize = 70,
      padding = 6,
      textX = imgSize + padding,
      textY = halfHeight

    let y = 0

    // 所持金の表示
    scene.add.text(padding, textY, "所持金:", createFontStyle("black")).setOrigin(0, 0.5)
    this.goldText = scene.add.text(90, textY, `${this.gold}G`, createFontStyle("orange")).setOrigin(0, 0.5)
    y += height + padding

    // 武器一覧の表示
    for (const key in fds) {
      const fd = fds[key],
        img = scene.add.image(padding, halfHeight, key).setDisplaySize(imgSize, imgSize).setOrigin(0, 0.5),
        priceText = scene.add.text(textX, textY, `${fd.price}G`, createFontStyle("orange")).setOrigin(0, 0.5),
        zone = scene.add.zone(0, 0, SIDE_BAR_WIDTH, height).setOrigin(0, 0).setInteractive(),
        container = scene.add.container(0, y, [img, priceText, zone])

      this.frogs[key] = {
        container: container,
        zone: zone
      }
      y += height + padding
    }

    this.textTweenManager = new TextTweenManager(scene)
  }

  canBuy(value: number): boolean {
    return this.gold >= value
  }

  upgrade(value: number) {
    this.gold -= value
    this.setGoldText()
  }

  canBuyFrog(name: FrogName): boolean {
    return this.gold >= this.getPrice(name)
  }

  buy(name: FrogName) {
    this.gold -= this.getPrice(name)
    this.setGoldText()
  }

  private getPrice(name: FrogName): number {
    const fds = frogDatas
    return fds[name].price
  }

  addGold(value: number) {
    this.gold += value
    this.setGoldText()
  }

  private setGoldText() {
    this.goldText.setText(`${this.gold}G`)
  }

  getFrogs(): Frogs {
    return this.frogs
  }

  notEnough() {
    this.textTweenManager.do("ゴールドが足りず\n購入できません", "notEnough")
  }
}
