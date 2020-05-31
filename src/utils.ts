import { WIDTH, HEIGHT } from "./constants"

export const determineZoom = (width: number, height: number): number => {
  const zooms = [2, 1.75, 1.5, 1.25]

  for (let zoom of zooms)
    if (width > WIDTH * zoom && height > HEIGHT * zoom)
      return zoom

  return 1
}
