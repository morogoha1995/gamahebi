import { Field } from "../objects/field"
import { Wave } from "../objects/snake/wave"
import { Shop } from "../objects/shop"
import { Frog } from "../objects/frog/frog"
import { FrogName } from "../../types/frog"
import { Bullet } from "../objects/bullet/bullet"
import { InfoWindow } from "../objects/frog/infoWindow"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: Phaser.GameObjects.Group
  private bulletGroup!: Phaser.GameObjects.Group
  private wave!: Wave
  private shop!: Shop
  private infoWindow!: InfoWindow
  private selectedFrog: Phaser.GameObjects.Image | null = null
  private frogSample: Phaser.GameObjects.Image | null = null

  constructor() {
    super({ key: "game" })
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
    this.physics.add.overlap(this.frogGroup, this.wave.snakeGroup, this.hitSnake)

    this.addEvents()
  }

  update() {
    this.checkFrogAttack()
    this.wave.update()
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

  private selectFrog(name: FrogName, x: number, y: number) {
    if (!this.shop.canBuyFrog(name))
      return

    this.selectedFrog = this.add.image(x, y, name)
      .setName(name)
      .setDepth(30)
    this.frogSample = this.add.image(0, 0, name)
      .setAlpha(0.6)
      .setVisible(false)
  }

  private removeFrog() {
    if (!this.selectFrog)
      return

    this.selectedFrog?.destroy()
    this.selectedFrog = null
    this.frogSample?.destroy()
    this.frogSample = null
  }

  private moveSelectedFrog(x: number, y: number) {
    if (!this.selectFrog)
      return

    this.selectedFrog?.setPosition(x, y)

    const tile = this.field.layer.getTileAtWorldXY(x, y)

    if (!tile)
      return

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

    this.shop.buy(name)
    const frog = new Frog(this, tile.getCenterX(), tile.getCenterY(), name, tX)
    frog.on("pointerdown", () => {
      if (this.infoWindow.isOpen)
        return

      const upgradePrice = frog.getUpgradePrice(),
        sellPrice = frog.getSellPrice()

      this.infoWindow.setInfo(
        frog.x,
        frog.y,
        frog.getInfoName(),
        upgradePrice,
        frog.getSellPrice()
      )
      this.infoWindow.tween("open")

      this.infoWindow.upgradeBtn
        .on("pointerdown", () => {
          if (this.infoWindow.inAnims)
            return

          if (this.shop.canBuy(frog.getUpgradePrice())) {
            this.infoWindow.tween("upgrade")
            this.shop.upgrade(upgradePrice)
            frog.upgrade()
          }
        })

      this.infoWindow.sellBtn
        .on("pointerdown", () => {
          if (this.infoWindow.inAnims)
            return

          this.shop.addGold(sellPrice)
          //this.field.destroyFrog(tY, tX)
          frog.destroy()
          this.infoWindow.tween("sell")
        })
    })
    this.frogGroup.add(frog)
    this.field.putFrog(tY, tX)
  }

  private hitBullet(snake: any, bullet: any) {
    if (bullet.isDying || snake.isDead())
      return

    bullet.die()
    snake.damaged(1)
    if (snake.isDead())
      this.shop.addGold(snake.getGold())
  }

  private hitSnake(frog: any, snake: any) {
    if (snake.isAttack || frog.col !== snake.col)
      return

    snake.attack()
    frog.damaged(1)
  }

  private checkFrogAttack() {
    this.wave.snakeGroup.children.iterate((s: any) =>
      this.frogGroup.children.iterate((f: any) => {
        if (f.canAttack(s.col)) {
          const b = new Bullet(this, f.x, f.y, f.name)
          this.bulletGroup.add(b)
          f.attack()
        }
      })
    )
  }
}
