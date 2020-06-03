import { TILE_SIZE, SIDE_BAR_WIDTH } from "../constants"

export class Field {
  private indexes = [
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
  ]

  layer: Phaser.Tilemaps.StaticTilemapLayer

  constructor(scene: Phaser.Scene) {
    const map = scene.make.tilemap({ data: this.indexes, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
    const tiles = map.addTilesetImage("tiles")
    this.layer = map.createStaticLayer(0, tiles, SIDE_BAR_WIDTH, 0)
  }
}
