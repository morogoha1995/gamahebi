import { SnakeName } from "../../../types/snake"
import { HALF_WIDTH } from "../../constants"
import { Snake } from "./snake"
import { createFontStyle } from "../../utils"

export class Wave {
  private scene: Phaser.Scene
  private _current = 1
  private spawnCount = 0
  private maxSpawnCount = 5
  private interval = 2000
  private nextSpawn = 0
  private isInNextDelay = false
  snakeGroup: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.snakeGroup = scene.add.group({ runChildUpdate: true })
  }

  canSpawn() {
    return this.scene.time.now >= this.nextSpawn && this.spawnCount < this.maxSpawnCount
  }

  private calcNextSpawn() {
    this.nextSpawn = this.scene.time.now + this.interval
  }

  private spawn() {
    const xCol = Phaser.Math.Between(0, 4)
    const name = this.determineSnakeName()
    this.snakeGroup.add(new Snake(this.scene, xCol, name))
    this.calcNextSpawn()
    this.spawnCount++
  }

  get current(): number {
    return this._current
  }

  update() {
    if (this.canSpawn())
      this.spawn()

    if (this.isGoNext())
      this.goNext()
  }

  private goNext() {
    this.isInNextDelay = true
    this._current++

    this.waveTextTween()
  }

  checkGameover(): boolean {
    let isGameover = false
    this.snakeGroup.children.iterate((snake: any) => {
      if (snake.isTouchBottom)
        isGameover = true
    })
    return isGameover
  }

  private init() {
    this.isInNextDelay = false
    this.spawnCount = 0
  }

  private waveTextTween() {
    const t = this.scene.add.text(HALF_WIDTH, 0, `第${this._current}波`, createFontStyle("blue", 3))
    t
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(50)
      .setAngle(-45)

    this.scene.add.tween({
      targets: t,
      duration: 1000,
      alpha: 1,
      angle: 0,
      y: 200,
      ease: "bounce",
      onComplete: () => this.scene.add.tween({
        targets: t,
        delay: 1000,
        duration: 500,
        alpha: 0,
        y: 0,
        ease: "cubic",
        onComplete: () => {
          t.destroy()
          this.init()
          this.upDifficulty()
        }
      })
    })
  }

  private upDifficulty() {
    this.maxSpawnCount += Math.max(1, Math.floor(this._current / 3))
  }

  private isGoNext(): boolean {
    return !this.isInNextDelay && this.spawnCount === this.maxSpawnCount && this.snakeGroup.getLength() === 0
  }

  private determineSnakeName(): SnakeName {
    // 上から弱い順。
    const enemyNames: SnakeName[] = [
      "normalSnake",
      "thinSnake",
      "ultSnake",
    ]

    // enemyNamesからどの名前を取り出すかの値が代入される。
    // 5ウェーブごとに取り出される敵の位が上がる。
    let enemyIndex = Math.floor(this._current / 5)
    // 生成数が3で割り切れる数の場合、1つ上位の敵を生成する
    if (this.spawnCount !== 0 && this.spawnCount % 3 === 0)
      enemyIndex++
    // enemyNamesの要素数を超えないように低い方を代入し直す。
    enemyIndex = Math.min(enemyIndex, enemyNames.length - 1)

    return enemyNames[enemyIndex]
  }
}
