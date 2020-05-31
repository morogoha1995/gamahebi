import { WIDTH, HEIGHT } from "./constants"

export const determineZoom = (width: number, height: number): number => {
  const zooms = [2, 1.75, 1.5, 1.25]

  for (let zoom of zooms)
    if (width > WIDTH * zoom && height > HEIGHT * zoom)
      return zoom

  return 1
}

export const createFontStyle = (color: string, fontSize = 24, isStroke = true) => {
  const fontStyle: any = {
    color: color,
    fontFamily: "Meiryo",
    fontSize: `${fontSize}px`,
    fontStyle: "bold"
  }

  if (isStroke) {
    fontStyle.stroke = "white"
    fontStyle.strokeThickness = 6
  }

  return fontStyle
}
