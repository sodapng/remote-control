import { dragMouse, mouseToggle, moveMouse } from 'robotjs'

export default function drawCircle(x: number, y: number, radius: number) {
  moveMouse(x - radius, y)
  mouseToggle('down')

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const _x = x - radius * Math.cos(i)
    const _y = y - radius * Math.sin(i)

    dragMouse(_x, _y)
  }

  mouseToggle('up')
}
