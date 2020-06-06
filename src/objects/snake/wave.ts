import { SnakeName } from "../../../types/snake"
import { SIDE_BAR_WIDTH, TILE_SIZE, HALF_TILE_SIZE } from "../../constants"
import { Snake } from "./snake"

export class Wave {
  private current = 1
  private spawnCount = 0
  private interval = 2000
  private nextSpawn = 5000
  snakeGroup: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene) {
    this.snakeGroup = scene.physics.add.group({ runChildUpdate: true })
  }

  canSpawn() {
    return this.snakeGroup.scene.time.now >= this.nextSpawn
  }

  private calcNextSpawn() {
    this.nextSpawn = this.snakeGroup.scene.time.now + this.interval
  }

  private determineSpawnX(): number {
    return SIDE_BAR_WIDTH + TILE_SIZE * this.determineSpawnCol() + HALF_TILE_SIZE
  }

  // 蛇をどの列に生成するかを割り出すメソッド
  private determineSpawnCol(): number {
    return Phaser.Math.Between(0, 4)
  }

  private spawn(name: SnakeName) {
    const x = this.determineSpawnX()
    const snake = new Snake(this.snakeGroup.scene, x, name)
    this.snakeGroup.add(snake)
    this.calcNextSpawn()
  }

  private makeSnake() {
    const snakeName = this.determineSnakeName()
    this.spawn(snakeName)
  }

  update() {
    if (this.canSpawn())
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
