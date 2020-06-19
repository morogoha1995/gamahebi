export type FrogName = "pistol" | "rapid" | "frozen"
export type Frogs = {
  [key: string]: {
    container: Phaser.GameObjects.Container,
    zone: Phaser.GameObjects.Zone
  }
}
