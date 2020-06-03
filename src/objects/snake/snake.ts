import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"
import { TILE_SIZE } from "../../constants"

export class Snake extends Phaser.GameObjects.Image {
  body!: Phaser.Physics.Arcade.Body
  private hp: number
  private speed: number

  constructor(scene: Phaser.Scene, x: number, name: SnakeName) {
    super(scene, x, 0, `${name}Snake`)

    this.x += this.width / 2

    scene.add.existing(this)
    scene.physics.world.enable(this)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed

    this
      .setDepth(20)
      .setSize(TILE_SIZE * sd.col, this.height)

    this.body.setVelocityY(this.speed)
  }
}
