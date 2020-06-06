import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE } from "../../constants"

export class Snake extends Phaser.GameObjects.Image {
  body!: Phaser.Physics.Arcade.Body
  private hp: number
  private speed: number

  constructor(scene: Phaser.Scene, x: number, name: SnakeName) {
    super(scene, x, 500, `${name}Snake`)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed

    this
      .setDepth(20)
    //.setSize(TILE_SIZE * sd.col, this.height)

    scene.add.existing(this)
  }

  update() {
    this.y += 3
  }

  damaged(atk: number) {
    this.destroy()
    this.hp -= atk
  }
}
