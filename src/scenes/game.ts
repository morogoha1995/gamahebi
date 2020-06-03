import { Field } from "../objects/field"
import { FrogGroup } from "../objects/frog/frogGroup"
import { Wave } from "../objects/snake/wave"
import { Shop } from "../objects/shop"
import { FrogName } from "../../types/frog"
import { Frog } from "../objects/frog/frog"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: FrogGroup
  private wave!: Wave
  private shop!: Shop
  private selectedFrog: Phaser.GameObjects.Image | null = null

  constructor() {
    super({ key: "game" })
  }

  create() {
    this.field = new Field(this)
    this.frogGroup = new FrogGroup(this)
    this.wave = new Wave(this)
    this.shop = new Shop(this)


    this.addEvents()
    this.wave.makeSnake()
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
    this.selectedFrog = this.add.image(x, y, key).setName(key)
  }

  private removeFrog() {
    if (!this.selectFrog)
      return

    this.selectedFrog?.destroy()
    this.selectedFrog = null
  }

  private moveSelectedFrog(x: number, y: number) {
    if (this.selectFrog !== null)
      this.selectedFrog?.setPosition(x, y)

    /* TODO
    const tile = this.field.layer.getTileAtWorldXY(x, y)

    if (!tile)
      return

    tile.setAlpha(0.5)
    */
  }

  private putSelectedFrog(x: number, y: number) {
    if (!this.selectedFrog)
      return

    const tile = this.field.layer.getTileAtWorldXY(x, y)

    if (!tile)
      return

    this.frogGroup.add(new Frog(this, tile.getCenterX(), tile.getCenterY(), this.selectedFrog.name))
    this.selectedFrog?.destroy()
    this.selectedFrog = null
  }
}
