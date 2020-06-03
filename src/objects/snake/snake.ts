import SnakeDatas from "../../datas/snake.json"
import { SnakeName } from "../../../types/snake"

export class Snake extends Phaser.GameObjects.Image {
  body!: Phaser.Physics.Arcade.Body
  private hp: number
  private speed: number

  constructor(scene: Phaser.Scene, x: number, name: SnakeName) {
    super(scene, x, 0, `${name}Snake`)

    scene.add.existing(this)
    scene.physics.world.enable(this)

    this.setDepth(20)

    const sd = SnakeDatas[name]
    this.hp = sd.hp
    this.speed = sd.speed

    this.body.setVelocityY(this.speed)
  }
}
