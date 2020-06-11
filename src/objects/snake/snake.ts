import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE } from "../../constants"

export class Snake extends Phaser.Physics.Arcade.Image {
  private hp: number
  private speed: number
  private col: number

  constructor(scene: Phaser.Scene, col: number, name: SnakeName) {
    super(scene, 0, 0, `${name}Snake`)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed
    this.col = col

    this
      .setDepth(20)
    //.setSize(TILE_SIZE * sd.col, this.height)
    const x = this.determineXFromCol()
    this.setPosition(x, 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.position.set(x, 0)
    this.setVelocityY(this.speed)
  }

  damaged(atk: number) {
    this.hp -= atk
  }

  private isDead(): boolean {
    return this.hp <= 0
  }

  private determineXFromCol(): number {
    const x = TILE_SIZE * this.col
    return SIDE_BAR_WIDTH + x + HALF_TILE_SIZE
  }

  checkDeath() {
    if (this.isDead())
      this.destroy()
  }
}
