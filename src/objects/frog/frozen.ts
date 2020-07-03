import { Frog } from "./frog"
import { Bullet } from "../bullet/bullet"

export class Frozen extends Frog {
  constructor(scene: Phaser.Scene, x: number, y: number, row: number, col: number) {
    super(scene, x, y, "frozen", row, col)
  }

  attack(bulletGroup: Phaser.GameObjects.Group) {
    bulletGroup.add(new Bullet(this.scene, this.x, this.y, "frozen", this.atk))
    this.calcNextAttack()
  }
}
