import { HALF_HEIGHT, HALF_WIDTH } from "../../constants"
import { createFontStyle } from "../../utils"
import { TweenName } from "../../../types/infoWindow"
import { FrogName } from "../../../types/frog"
import { TextTweenManager } from "../textTweenManager"

export class InfoWindow extends Phaser.GameObjects.Container {
  private _isOpen = false
  private _inAnims = false
  private baseX = 0
  private baseY = 0
  private title: Phaser.GameObjects.Text
  private hp: Phaser.GameObjects.Text
  private upgradeText: Phaser.GameObjects.Text
  private sellText: Phaser.GameObjects.Text
  private textTweenManager: TextTweenManager

  constructor(scene: Phaser.Scene) {
    super(scene)

    this.title = scene.add.text(0, 0, "")
    this.hp = scene.add.text(0, 0, "")
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

    this.textTweenManager = new TextTweenManager(scene)

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

  private btnPushTween(btnName: string) {
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
    this.btnPushTween("upgrade")
  }

  private sellTween() {
    this.btnPushTween("sell")
  }

  private setBtnText(x: number, text: string, color: string, bgColor: string): Phaser.GameObjects.Text {
    return this.scene.add.text(x, 80, text, createFontStyle(color, 1.5))
      .setInteractive()
      .setBackgroundColor(bgColor)
      .setPadding(6, 6, 6, 6)
      .setOrigin(0.5)
  }

  setInfo(name: FrogName, x: number, y: number, nameInfo: string, price: number, sellPrice: number, hp: string) {
    this.baseX = x
    this.baseY = y
    this.setPosition(x, y)

    this.title = this.scene.add.text(0, -80, nameInfo, createFontStyle("teal", 2))
      .setOrigin(0.5)

    this.hp = this.scene.add.text(0, 0, hp, createFontStyle("crimson", 1.5))
      .setOrigin(0.5)

    const isShield = name === "shield",
      sellBtnX = isShield ? 0 : 120

    this.sellText = this.setBtnText(sellBtnX, `売却: ${sellPrice}G`, "blue", "green")

    this.add([
      this.title,
      this.hp,
      this.sellText
    ])

    if (!isShield) {
      this.upgradeText = this.setBtnText(-120, `強化: ${price}G`, "red", "blue")
      this.add(this.upgradeText)
    }
  }

  tween(name: TweenName) {
    if (this._inAnims)
      return

    this._inAnims = true

    if (name === "open") {
      this.scene.sound.play("btn")
      this.openTween()
    }
    else if (name === "close") {
      this.scene.sound.play("btn")
      this.closeTween()
    }
    else if (name === "upgrade") {
      this.scene.sound.play("buy")
      this.upgradeTween()
    }
    else if (name === "sell") {
      this.scene.sound.play("earn")
      this.sellTween()
    }
    else if (name === "notEnoughGold")
      this.textTweenManager.do("ゴールドが足りません", () => this.closeTween())
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
      this.hp,
      this.upgradeText,
      this.sellText,
    ], true)
    this
      .setVisible(false)
      .setActive(false)
  }

  reviseHpText(value: string) {
    this.hp.setText(value)
  }

  // ガマの位置からどのガマのInfoWindowかを割り出す
  // 渡されたx, y(ガマのx, y)と現在のInfoWindowのbaseX, baseYが同じ値だった場合、そのガマのInfoWindowが開かれているということになる
  determineFromFrogPos(x: number, y: number): boolean {
    return x === this.baseX && y === this.baseY
  }
}
