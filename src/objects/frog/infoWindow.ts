import { HALF_HEIGHT, HALF_WIDTH } from "../../constants"
import { createFontStyle } from "../../utils"
import { TweenName } from "../../../types/infoWindow"

export class InfoWindow extends Phaser.GameObjects.Container {
  private _isOpen = false
  private _inAnims = false
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
      .setDepth(51)
      .setScale(0)
      .add([
        scene.add.rectangle(0, 0, 500, 340, 0xF0F0F0, 0.6)
          .setOrigin(0.5),
        scene.add.image(220, -140, "x")
          .setInteractive()
          .on("pointerdown", () => this.tween("close"))
      ])

    scene.add.existing(this)
  }

  get inAnims(): boolean {
    return this._inAnims
  }

  get isOpen(): boolean {
    return this._isOpen
  }

  get upgradeBtn(): Phaser.GameObjects.Text {
    return this.upgradeText
  }

  get sellBtn(): Phaser.GameObjects.Text {
    return this.sellText
  }

  private openTween() {
    this._isOpen = true
    this
      .setVisible(true)
      .setActive(true)

    this.scene.add.tween({
      targets: this,
      duration: 200,
      scale: 1,
      x: HALF_WIDTH,
      y: HALF_HEIGHT,
      ease: "back",
      onComplete: () => this._inAnims = false
    })
  }

  private btnTween(btnName: string) {
    const btn = btnName === "upgrade" ? this.upgradeText : this.sellText

    this.scene.add.tween({
      targets: btn,
      duration: 160,
      y: btn.y + 10,
      scale: 0.9,
      yoyo: true,
      onComplete: () => {
        this.closeTween()
      }
    })
  }

  private upgradeTween() {
    // this.scene.sound.play("upgrade")
    this.btnTween("upgrade")
  }

  private sellTween() {
    // this.scene.sound.play("sell")
    this.btnTween("sell")
  }

  private textTween(text: string) {
    // this.scene.sound.play("notEnough")

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

    const btnY = 80

    this.title = this.scene.add.text(0, -80, name, createFontStyle("teal", 2))
      .setOrigin(0.5)

    this.upgradeText = this.scene.add.text(-120, btnY, `強化: ${price}G`, createFontStyle("red", 1.5))
      .setInteractive()
      .setBackgroundColor("blue")
      .setPadding(6, 6, 6, 6)
      .setOrigin(0.5)

    this.sellText = this.scene.add.text(120, btnY, `売却: ${sellPrice}G`, createFontStyle("blue", 1.5))
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
    if (this._inAnims)
      return

    this._inAnims = true

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
      ease: "Back.easeIn",
      onComplete: () => this.close()
    })
  }

  private close() {
    this._isOpen = false
    this._inAnims = false
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
