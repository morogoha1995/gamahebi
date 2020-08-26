import { Field } from "../objects/field"
import { Wave } from "../objects/snake/wave"
import { Shop } from "../objects/shop"
import { Frog } from "../objects/frog/frog"
import { FrogName } from "../../types/frog"
import { InfoWindow } from "../objects/frog/infoWindow"
import { Pistol } from "../objects/frog/pistol"
import { Rapid } from "../objects/frog/rapid"
import { Frozen } from "../objects/frog/frozen"
import { TitleContainer } from "../objects/titleContainer"
import { WIDTH, HEIGHT, notEnoughTween } from "../constants"
import { Shield } from "../objects/frog/shield"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: Phaser.GameObjects.Group
  private bulletGroup!: Phaser.GameObjects.Group
  private wave!: Wave
  private shop!: Shop
  private infoWindow!: InfoWindow
  private selectedFrog: Phaser.GameObjects.Image | null = null
  private frogSample: Phaser.GameObjects.Image | null = null

  private isPlaying = false

  constructor() {
    super({ key: "game" })
  }

  init(data: any) {
    this.isPlaying = data.isPlaying || false
    this.sound.mute = data.isMute || false
  }

  create() {
    this.field = new Field(this)
    this.frogGroup = this.add.group()
    this.bulletGroup = this.add.group()
    this.wave = new Wave(this)
    this.shop = new Shop(this)
    this.infoWindow = new InfoWindow(this)

    // Add collision
    this.physics.add.overlap(this.wave.snakeGroup, this.bulletGroup, this.hitBullet, undefined, this)
    this.physics.add.overlap(this.frogGroup, this.wave.snakeGroup, this.hitSnake, undefined, this)

    if (!this.isPlaying)
      this.createStartWindow()
    else
      this.addEvents()
  }

  update() {
    if (!this.isPlaying)
      return

    if (this.wave.checkGameover())
      this.gameover()

    this.checkFrogAttack()
    this.wave.update()
  }

  private createStartWindow() {
    const startWindow = new TitleContainer(this, "がまへび合戦", "teal", this.sound.mute)

    startWindow.addStartBtn("スタート", () => {
      this.isPlaying = true
      this.addEvents()
      startWindow.destroy()
    })
  }

  private addEvents() {
    const frogs = this.shop.getFrogs()
    for (const key in frogs) {
      const name = <FrogName>key
      frogs[key].zone.on("pointerdown", (e: any) => this.selectFrog(name, e.x, e.y))
    }

    this.input
      .on("pointermove", (e: any) => this.moveSelectedFrog(e.x, e.y))
      .on("pointerup", (e: any) => this.putSelectedFrog(e.x, e.y))
  }

  private gameover() {
    this.sound.play("dead")
    this.scene.pause()
    this.scene.launch("end", {
      isMute: this.sound.mute,
      wave: this.wave.current
    })
  }

  private selectFrog(name: FrogName, x: number, y: number) {
    if (!this.shop.canBuyFrog(name)) {
      notEnoughTween(this)
      return
    }

    this.selectedFrog = this.add.image(x, y, name)
      .setName(name)
      .setDepth(30)
    this.frogSample = this.add.image(0, 0, name)
      .setAlpha(0.6)
      .setVisible(false)
  }

  private removeFrog() {
    if (!this.selectedFrog)
      return

    this.selectedFrog.destroy()
    this.selectedFrog = null
    this.frogSample?.destroy()
    this.frogSample = null
  }

  private moveSelectedFrog(x: number, y: number) {
    if (!this.selectedFrog)
      return

    this.selectedFrog.setPosition(x, y)

    const tile = this.field.layer.getTileAtWorldXY(x, y)

    if (!tile) {
      this.frogSample?.setVisible(false)
      return
    }

    if (this.field.canPutFrog(tile.y, tile.x))
      this.frogSample?.setPosition(tile.getCenterX(), tile.getCenterY())
        .setVisible(true)
    else
      this.frogSample?.setVisible(false)
  }

  private putSelectedFrog(x: number, y: number) {
    if (!this.selectedFrog)
      return

    const name = <FrogName>this.selectedFrog.name
    this.removeFrog()

    const tile = this.field.layer.getTileAtWorldXY(x, y)

    if (!tile)
      return

    const tX = tile.x,
      tY = tile.y

    if (!this.field.canPutFrog(tY, tX))
      return

    this.sound.play("buy")
    this.shop.buy(name)

    let frog: Frog
    const tCX = tile.getCenterX(),
      tCY = tile.getCenterY()

    if (name === "rapid")
      frog = new Rapid(this, tCX, tCY, tY, tX)
    else if (name === "frozen")
      frog = new Frozen(this, tCX, tCY, tY, tX)
    else if (name === "shield")
      frog = new Shield(this, tCX, tCY, tY, tX)
    else
      frog = new Pistol(this, tCX, tCY, tY, tX)

    frog.on("pointerdown", () => {
      if (this.infoWindow.isOpen)
        return

      const upgradePrice = frog.upgradePrice,
        sellPrice = frog.sellPrice

      this.infoWindow.setInfo(
        name,
        frog.x,
        frog.y,
        frog.nameInfo,
        upgradePrice,
        sellPrice,
        frog.hpInfo
      )
      this.infoWindow.tween("open")

      this.infoWindow.upgradeBtn
        .on("pointerdown", () => {
          if (this.infoWindow.inAnims)
            return

          if (this.shop.canBuy(upgradePrice)) {
            this.infoWindow.tween("upgrade")
            this.shop.upgrade(upgradePrice)
            frog.upgrade()
          } else {
            this.infoWindow.tween("notEnoughGold")
          }
        })

      this.infoWindow.sellBtn
        .on("pointerdown", () => {
          if (this.infoWindow.inAnims)
            return

          this.shop.addGold(sellPrice)
          this.field.destroyFrog(frog.row, frog.col)
          frog.sell()
          this.infoWindow.tween("sell")
        })
    })
    this.frogGroup.add(frog)
    this.field.putFrog(tY, tX)
  }

  private hitBullet(snake: any, bullet: any) {
    if (bullet.isDying || snake.isDead)
      return

    bullet.die()
    snake.damaged(bullet.atk, bullet.name)
    if (snake.isDead)
      this.shop.addGold(snake.getGold())
  }

  private hitSnake(frog: any, snake: any) {
    if (snake.isAttack || frog.col !== snake.col)
      return

    snake.attack()
    frog.damaged(1)

    if (this.infoWindow.isOpen)
      if (this.infoWindow.determineFromFrogPos(frog.x, frog.y))
        if (frog.isDead)
          this.infoWindow.tween("close")
        else
          this.infoWindow.reviseHpText(frog.hpInfo)

    if (frog.isDead)
      this.field.destroyFrog(frog.row, frog.col)
  }

  private checkFrogAttack() {
    this.wave.snakeGroup.children.iterate((s: any) =>
      this.frogGroup.children.iterate((f: any) => {
        if (f.canAttack(s.col))
          f.attack(this.bulletGroup)
      })
    )
  }
}
