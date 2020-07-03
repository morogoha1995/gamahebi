import { Frog } from "./frog"
import { Bullet } from "../bullet/bullet"

export class Pistol extends Frog {
  constructor(scene: Phaser.Scene, x: number, y: number, row: number, col: number) {
    super(scene, x, y, "pistol", row, col)
  }

  attack(bulletGroup: Phaser.GameObjects.Group) {
    bulletGroup.add(new Bullet(this.scene, this.x, this.y, "pistol", this.atk))
    this.calcNextAttack()
  }
}
