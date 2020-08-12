import { SnakeName } from "../../../types/snake"
import { HALF_WIDTH } from "../../constants"
import { Snake } from "./snake"
import { createFontStyle } from "../../utils"

export class Wave {
  private readonly scene: Phaser.Scene
  private _current = 1
  private spawnCount = 0
  private maxSpawnCount = 5
  private interval = 2000
  private hpMultiple = 1
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
    this.spawnCount++
    const xCol = Phaser.Math.Between(0, 4)
    const name = this.determineSnakeName()
    this.snakeGroup.add(new Snake(this.scene, xCol, name, this.hpMultiple))
    this.calcNextSpawn()
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

  // _currentの値によって難易度を変える
  private upDifficulty() {
    this.maxSpawnCount++
    this.interval -= 150

    if (this._current % 6 === 0)
      this.hpMultiple += 0.2

    if (this._current % 10 === 0)
      this.initDifficulty()
  }

  private initDifficulty() {
    this.maxSpawnCount = 5
    this.interval = 2000
  }

  private isGoNext(): boolean {
    return !this.isInNextDelay && this.spawnCount === this.maxSpawnCount && this.snakeGroup.getLength() === 0
  }

  get onesPlace() {
    const currentStr = this._current.toString()
    const onesPlace = Number(currentStr[currentStr.length - 1])
    return Math.max(onesPlace, 1)
  }

  private determineSnakeName(): SnakeName {
    // 上から弱い順。
    const enemyNames: SnakeName[] = [
      "normalSnake",
      "thinSnake",
      "ultSnake",
    ]

    // enemyNamesからどの名前を取り出すかの値が代入される。
    let enemyIndex = Math.floor(this.onesPlace / 4)
    // 現在生成している敵の番号が3で割り切れる場合、1つ上位の敵を生成する。
    if (this.spawnCount !== 0 && this.spawnCount % 3 === 0)
      enemyIndex++
    // enemyNamesの要素数を超えないように低い方を代入し直す。
    enemyIndex = Math.min(enemyIndex, enemyNames.length - 1)

    return enemyNames[enemyIndex]
  }
}
