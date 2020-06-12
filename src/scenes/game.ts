import { Field } from "../objects/field"
import { Wave } from "../objects/snake/wave"
import { Shop } from "../objects/shop"
import { Frog } from "../objects/frog/frog"
import { FrogName } from "../../types/frog"
import { Bullet } from "../objects/bullet/bullet"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: Phaser.GameObjects.Group
  private bulletGroup!: Phaser.GameObjects.Group
  private wave!: Wave
  private shop!: Shop
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

    // Add collision
    this.physics.add.overlap(this.wave.snakeGroup, this.bulletGroup, this.hitBullet)
    this.physics.add.overlap(this.frogGroup, this.wave.snakeGroup, this.hitSnake)

    this.addEvents()
  }

  update() {
    this.checkFrogAttack()
    this.wave.update()
  }

  private addEvents() {
    const frogs = this.shop.getFrogs()
    for (const key in frogs)
      frogs[key].zone.on("pointerdown", (e: any) => this.selectFrog(key, e.x, e.y))

    this.input
      .on("pointermove", (e: any) => this.moveSelectedFrog(e.x, e.y))
      .on("pointerup", (e: any) => this.putSelectedFrog(e.x, e.y))
  }

  private selectFrog(key: string, x: number, y: number) {
    this.selectedFrog = this.add.image(x, y, key)
      .setName(key)
      .setDepth(30)
    this.frogSample = this.add.image(0, 0, key)
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

    if (tile && this.field.canPutFrog(tile.y, tile.x)) {
      this.frogGroup.add(new Frog(this, tile.getCenterX(), tile.getCenterY(), name, tile.x))
      this.field.putFrog(tile.y, tile.x)
    }
  }

  private hitBullet(snake: any, bullet: any) {
    if (bullet.isDying)
      return

    bullet.die()
    snake.damaged(1)
  }

  private hitSnake(frog: any, snake: any) {
    if (snake.isAttack)
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
