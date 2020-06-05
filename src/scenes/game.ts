import { Field } from "../objects/field"
import { FrogGroup } from "../objects/frog/frogGroup"
import { Wave } from "../objects/snake/wave"
import { Shop } from "../objects/shop"
import { Frog } from "../objects/frog/frog"
import { FrogName } from "../../types/frog"
import { BulletGroup } from "../objects/bullet/bulletGroup"
import { Bullet } from "../objects/bullet/bullet"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: FrogGroup
  private bulletGroup!: BulletGroup
  private wave!: Wave
  private shop!: Shop
  private selectedFrog: Phaser.GameObjects.Image | null = null
  private frogSample: Phaser.GameObjects.Image | null = null

  constructor() {
    super({ key: "game" })
  }

  create() {
    this.field = new Field(this)
    this.frogGroup = new FrogGroup(this)
    this.bulletGroup = new BulletGroup(this)
    this.wave = new Wave(this)
    this.shop = new Shop(this)


    this.addEvents()
    this.wave.makeSnake()
  }

  update() {
    this.checkFrogAttack()
  }

  private addEvents() {
    const frogs = this.shop.getFrogs()
    for (const key in frogs)
      frogs[key].on("pointerdown", (e: any) => this.selectFrog(key, e.x, e.y))

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
      this.frogGroup.add(new Frog(this, tile.getCenterX(), tile.getCenterY(), name))
      this.field.putFrog(tile.y, tile.x)
    }
  }

  private checkFrogAttack() {
    this.frogGroup.children.iterate((f: any) => {
      if (f.canAttack())
        this.bulletGroup.add(f.attack())
    })
  }
}
