import { TILE_SIZE, SIDE_BAR_WIDTH, HALF_TILE_SIZE } from "../constants"

export class Field {
  private map: number[][]

  constructor(scene: Phaser.Scene) {
    const col = 5,
      row = 7,
      indexes: number[][] = []

    let x = SIDE_BAR_WIDTH,
      y = 0,
      imageFrame = 0

    for (let i = 0; i < row; i++) {
      indexes[i] = []
      for (let j = 0; j < col; j++) {
        indexes[i][j] = 0
        scene.add.image(x, y, "tiles", imageFrame)
          .setOrigin(0)
        imageFrame = imageFrame === 0 ? 1 : 0
        x += TILE_SIZE
      }

      x = SIDE_BAR_WIDTH
      y += TILE_SIZE
    }

    this.map = indexes
  }

  getTileCenterPos(x: number, y: number): { [key: string]: number } | false {
    if (x < SIDE_BAR_WIDTH)
      return false

    x -= SIDE_BAR_WIDTH

    const index = this.getIndex(x, y)

    console.log(index)

    return {
      x: TILE_SIZE * index.x + HALF_TILE_SIZE + SIDE_BAR_WIDTH,
      y: TILE_SIZE * index.y + HALF_TILE_SIZE
    }
  }

  canPutFrog(x: number, y: number): boolean {
    if (x < SIDE_BAR_WIDTH)
      return false

    x -= SIDE_BAR_WIDTH

    const index = this.getIndex(x, y)
    return this.map[index.y][index.x] === 0
  }

  private getIndex(x: number, y: number) {
    const xIndex = Math.floor(x / TILE_SIZE),
      yIndex = Math.floor(y / TILE_SIZE)

    return {
      x: xIndex,
      y: yIndex
    }
  }
}
