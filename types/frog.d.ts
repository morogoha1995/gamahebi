export type ShootableName = "pistol" | "rapid" | "frozen"

export type UnshootableName = "shield"

export type FrogName = ShootableName | UnshootableName

export type Frogs = {
  [key: string]: {
    container: Phaser.GameObjects.Container,
    zone: Phaser.GameObjects.Zone
  }
}
