import { TILE_SIZE, SIDE_BAR_WIDTH } from "../constants"

export class Field {
  private indexes: number[][] = []
  layer: Phaser.Tilemaps.StaticTilemapLayer

  constructor(scene: Phaser.Scene) {
    const cols = 5,
      rows = 7,
      imgData: number[][] = []

    let imgFrame = 0

    for (let row = 0; row < rows; row++) {
      this.indexes[row] = []
      imgData[row] = []
      for (let col = 0; col < cols; col++) {
        this.indexes[row][col] = 0
        imgData[row][col] = imgFrame
        imgFrame = imgFrame === 0 ? 1 : 0
      }
    }

    const map = scene.make.tilemap({ data: imgData, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
    const tiles = map.addTilesetImage("tiles")
    this.layer = map.createStaticLayer(0, tiles, SIDE_BAR_WIDTH, 0)
  }

  canPutFrog(row: number, col: number): boolean {
    return this.indexes[row][col] === 0
  }

  putFrog(row: number, col: number) {
    this.indexes[row][col] = 1
  }

  destroyFrog(row: number, col: number) {
    this.indexes[row][col] = 0
  }
}
