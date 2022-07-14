import { dragMouse, mouseToggle } from 'robotjs'

export default function drawLine(
  x: number,
  y: number,
  width: number,
  height?: number
) {
  mouseToggle('down')
  dragMouse(x + width, y)
  dragMouse(x + width, y + (height || width))
  dragMouse(x, y + (height || width))
  dragMouse(x, y)
  mouseToggle('up')
}
