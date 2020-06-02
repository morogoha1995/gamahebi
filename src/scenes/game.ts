import { Field } from "../objects/field"
import { FrogGroup } from "../objects/frog/frogGroup"
import { Wave } from "../objects/snake/wave"
import { Shop } from "../objects/shop"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: FrogGroup
  private wave!: Wave
  private shop!: Shop

  constructor() {
    super({ key: "game" })
  }

  create() {
    this.field = new Field(this)
    this.frogGroup = new FrogGroup(this)
    this.wave = new Wave(this)
    this.shop = new Shop(this)

    this.wave.makeSnake()
  }
}
