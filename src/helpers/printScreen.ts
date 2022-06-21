import Jimp from 'jimp'
import { screen } from 'robotjs'

export default async function printScreen(
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Jimp> {
  return new Promise((resolve) => {
    const bitmap = screen.capture(x, y, width, height)
    const image = new Jimp(bitmap.width, bitmap.height)

    let pos = 0

    image.scanQuiet(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x, y, idx) => {
        image.bitmap.data[idx + 2] = bitmap.image.readUInt8(pos++)
        image.bitmap.data[idx + 1] = bitmap.image.readUInt8(pos++)
        image.bitmap.data[idx + 0] = bitmap.image.readUInt8(pos++)
        image.bitmap.data[idx + 3] = bitmap.image.readUInt8(pos++)
      }
    )

    resolve(image)
  })
}
