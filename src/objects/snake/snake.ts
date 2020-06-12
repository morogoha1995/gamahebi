import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE } from "../../constants"
import { Organism } from "../organism"

export class Snake extends Organism {
  private speed: number

  constructor(scene: Phaser.Scene, col: number, name: SnakeName) {
    super(scene, 0, 0, name, col)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed

    const x = TILE_SIZE * col + SIDE_BAR_WIDTH + HALF_TILE_SIZE
    this
      .setDepth(20)
      .setPosition(x, 0)
    this.body.position.set(x, 0)
    this.setVelocityY(this.speed)
  }
}
