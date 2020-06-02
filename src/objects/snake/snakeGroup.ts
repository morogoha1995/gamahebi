import { SnakeName } from "../../../types/snake"
import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE } from "../../constants"
import { Snake } from "./snake"

export class SnakeGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene)
  }

  spawn(name: SnakeName) {
    const x = this.determineSpawnX()
    const snake = new Snake(this.scene, x, name)
    this.add(snake)
  }

  private determineSpawnX(): number {
    return SIDE_BAR_WIDTH + HALF_TILE_SIZE + TILE_SIZE * this.determineSpawnCol()
  }

  // 蛇をどの列に生成するかを割り出すメソッド
  private determineSpawnCol(): number {
    return Phaser.Math.Between(0, 4)
  }
}
