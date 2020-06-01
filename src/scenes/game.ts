import { Field } from "../objects/field"
import { FrogGroup } from "../objects/frog/frogGroup"

export class Game extends Phaser.Scene {
  private field!: Field
  private frogGroup!: FrogGroup

  constructor() {
    super({ key: "game" })
  }

  create() {
    this.field = new Field(this)
    this.frogGroup = new FrogGroup(this)
  }
}
