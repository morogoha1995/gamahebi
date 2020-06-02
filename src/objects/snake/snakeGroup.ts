import { SnakeName } from "../../../types/snake"
import { TILE_SIZE } from "../../constants"

export class SnakeGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene)
  }

  move() {
    this.children.iterate((e: any) => {
      e.move()
    })
  }

  spawn(name: SnakeName) {
    const x = TILE_SIZE * this.determineSpawnCol()
    const snake = new Snake(this.scene, x, name)
    this.add(snake)
  }

  // 蛇をどの列に生成するかを割り出すメソッド
  private determineSpawnCol(): number {
    return Phaser.Math.Between(0, 6)
  }
}
