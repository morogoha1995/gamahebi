import { Frog } from "./frog"

export class Shield extends Frog {
  constructor(scene: Phaser.Scene, x: number, y: number, row: number, col: number) {
    super(scene, x, y, "shield", row, col)
  }
}
