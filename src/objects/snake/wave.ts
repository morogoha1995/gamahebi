import { SnakeGroup } from "./snakeGroup"
import { SnakeName } from "../../../types/snake"

export class Wave {
  private current = 1
  private spawnCount = 0
  private nextSpawn = 0
  snakeGroup: SnakeGroup

  constructor(scene: Phaser.Scene) {
    this.snakeGroup = new SnakeGroup(scene)
  }

  private makeSnake() {
    const snakeName = this.determineSnakeName()
    this.snakeGroup.spawn(snakeName)

  }

  update() {
    if (this.snakeGroup.canSpawn())
      this.makeSnake()
  }

  private determineSnakeName(): SnakeName {
    // 上から弱い順。
    const enemyNames: SnakeName[] = [
      "normal",
    ]

    // enemyNamesからどの名前を取り出すかの値が代入される。
    // 5ウェーブごとに取り出される敵の位が上がる。
    let enemyIndex = Math.floor(this.current / 5)
    // 生成数が3で割り切れる数の場合、1つ上位の敵を生成する
    if (this.spawnCount % 3 === 0)
      enemyIndex++
    // enemyNamesの要素数を超えないように低い方を代入し直す。
    enemyIndex = Math.min(enemyIndex, enemyNames.length - 1)

    return enemyNames[enemyIndex]
  }
}
