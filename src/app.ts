import robot from 'robotjs'
import drawCircle from './helpers/drawCircle'
import drawLine from './helpers/drawLine'
import printScreen from './helpers/printScreen'

export default function app() {
  const { x, y } = robot.getMousePos()

  return {
    mouse_up: (_y: number) => {
      robot.moveMouse(x, y - _y)
    },
    mouse_down: (_y: number) => {
      robot.moveMouse(x, y + _y)
    },
    mouse_left: (_x: number) => {
      robot.moveMouse(x - _x, y)
    },
    mouse_right: (_x: number) => {
      robot.moveMouse(x + _x, y)
    },
    mouse_position: () => {
      return `${x},${y}`
    },
    prnt_scrn: async () => {
      const image = await printScreen(x, y, 200, 200)
      const base64 = await image.getBase64Async(image.getMIME())
      return base64.substring(22)
    },
    draw_square: (length: number) => {
      drawLine(x, y, length)
    },
    draw_rectangle: (width: number, height: number) => {
      drawLine(x, y, width, height)
    },
    draw_circle: (radius: number) => {
      drawCircle(x, y, radius)
    },
  }
}
