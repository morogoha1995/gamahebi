import { Frog } from "./frog"
import { Bullet } from "../bullet/bullet"

export class Rapid extends Frog {
  constructor(scene: Phaser.Scene, x: number, y: number, row: number, col: number) {
    super(scene, x, y, "rapid", row, col)
  }

  private createBullet() {
    return new Bullet(this.scene, this.x, this.y, "pistol")
  }

  attack(bulletGroup: Phaser.GameObjects.Group) {
    const shotCount = 3,
      interval = 200

    let delay = 0

    for (let i = 0; i < shotCount; i++) {
      this.scene.time.delayedCall(delay, () => {
        bulletGroup.add(this.createBullet())
      })

      delay += interval
    }

    this.calcNextAttack()
  }
}
