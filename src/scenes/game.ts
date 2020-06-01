import { Field } from "../objects/field"

export class Game extends Phaser.Scene {
  private field!: Field

  constructor() {
    super({ key: "game" })
  }

  create() {
    this.field = new Field(this)
  }
}
