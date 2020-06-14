import { HALF_HEIGHT, HALF_WIDTH } from "../../constants"
import { createFontStyle } from "../../utils"
import { TweenName } from "../../../types/infoWindow"

export class InfoWindow extends Phaser.GameObjects.Container {
  private isOpen = false
  private isDuringAnims = false
  private baseX = 0
  private baseY = 0
  private title: Phaser.GameObjects.Text
  private upgradeText: Phaser.GameObjects.Text
  private sellText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    super(scene)

    this.title = scene.add.text(0, 0, "")
    this.upgradeText = scene.add.text(0, 0, "")
    this.sellText = scene.add.text(0, 0, "")

    this
      .setDepth(20)
      .setScale(0)
      .add([
        scene.add.rectangle(0, 0, 280, 200, 0x606060, 0.6)
          .setOrigin(0.5),
        scene.add.image(110, -70, "x")
          .setInteractive()
          .on("pointerdown", () => this.tween("close"))
      ])

    scene.add.existing(this)
  }

  get inAnims(): boolean {
    return this.isDuringAnims
  }

  get inOpen(): boolean {
    return this.isOpen
  }

  get upgradeBtn(): Phaser.GameObjects.Text {
    return this.upgradeText
  }

  get sellBtn(): Phaser.GameObjects.Text {
    return this.sellText
  }

  private openTween() {
    this.isOpen = true
    this
      .setVisible(true)
      .setActive(true)

    this.scene.add.tween({
      targets: this,
      duration: 200,
      scale: 1,
      x: HALF_WIDTH,
      y: HALF_HEIGHT,
      onComplete: () => this.isDuringAnims = false
    })
  }

  private handTween(x: number, y: number) {
    const hand = this.scene.add.image(x, y, "hand")
    this.add(hand)

    this.scene.add.tween({
      targets: hand,
      duration: 160,
      angle: 90,
      yoyo: true,
      onComplete: () => {
        this.remove(hand, true)
        this.closeTween()
      }
    })
  }

  private upgradeTween() {
    this.scene.sound.play("upgrade")
    this.handTween(-100, 10)
  }

  private sellTween() {
    this.scene.sound.play("sell")
    this.handTween(20, 10)
  }

  private textTween(text: string) {
    this.scene.sound.play("notEnough")

    const t = this.scene.add.text(0, 0, text, createFontStyle("#202020"))
      .setOrigin(0.5)
      .setAngle(-5)

    this.add(t)

    this.scene.add.tween({
      targets: t,
      duration: 200,
      angle: 5,
      yoyo: true,
      onComplete: () => {
        this.remove(t, true)
        this.closeTween()
      }
    })
  }

  setInfo(x: number, y: number, name: string, price: number, sellPrice: number) {
    this.baseX = x
    this.baseY = y
    this.setPosition(x, y)

    const btnY = 40,
      btnFontSize = 16

    this.title = this.scene.add.text(0, -40, name, createFontStyle("teal"))
      .setOrigin(0.5)

    this.upgradeText = this.scene.add.text(-60, btnY, `強化: ${price}G`, createFontStyle("red", btnFontSize))
      .setInteractive()
      .setBackgroundColor("blue")
      .setPadding(6, 6, 6, 6)
      .setOrigin(0.5)

    this.sellText = this.scene.add.text(60, btnY, `売却: ${sellPrice}G`, createFontStyle("blue", btnFontSize))
      .setInteractive()
      .setPadding(6, 6, 6, 6)
      .setBackgroundColor("green")
      .setOrigin(0.5)

    this.add([
      this.title,
      this.upgradeText,
      this.sellText
    ])
  }

  tween(name: TweenName) {
    if (this.isDuringAnims)
      return

    this.isDuringAnims = true

    if (name === "open")
      this.openTween()
    else if (name === "close")
      this.closeTween()
    else if (name === "upgrade")
      this.upgradeTween()
    else if (name === "sell")
      this.sellTween()
    else if (name === "notEnoughGold")
      this.textTween("ゴールドが足りません")
  }


  private closeTween() {
    this.scene.add.tween({
      targets: this,
      duration: 200,
      scale: 0,
      x: this.baseX,
      y: this.baseY,
      onComplete: () => this.close()
    })
  }

  private close() {
    this.isOpen = false
    this.isDuringAnims = false
    this.remove([
      this.title,
      this.upgradeText,
      this.sellText,
    ], true)
    this
      .setVisible(false)
      .setActive(false)
  }
}
