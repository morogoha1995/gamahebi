export type FrogName = "pistol" | "rapid"
export type Frogs = {
  [key: string]: {
    container: Phaser.GameObjects.Container,
    zone: Phaser.GameObjects.Zone
  }
}
