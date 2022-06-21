import { httpServer } from './src/http_server/index'
import robot from 'robotjs'
import { createWebSocketStream, WebSocketServer } from 'ws'
import printScreen from './src/helpers/printScreen'

const HTTP_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: 8080 })

const drawLine = (x: number, y: number, width: number, height?: number) => {
  robot.mouseToggle('down')
  robot.dragMouse(x + width, y)
  robot.dragMouse(x + width, y + (height || width))
  robot.dragMouse(x, y + (height || width))
  robot.dragMouse(x, y)
  robot.mouseToggle('up')
}

const drawCircle = (x: number, y: number, radius: number) => {
  robot.moveMouse(x + radius, y)
  robot.mouseToggle('down')

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const dx = x + radius * Math.cos(i)
    const dy = y + radius * Math.sin(i)

    robot.dragMouse(dx, dy)
  }

  robot.mouseToggle('up')
}

wss.on('connection', async (ws) => {
  const duplex = createWebSocketStream(ws, {
    allowHalfOpen: false,
    encoding: 'utf8',
    decodeStrings: false,
  })

  let data = ''

  duplex.on('readable', () => {
    let chunk

    while (null !== (chunk = duplex.read())) {
      data += chunk
    }

    duplex.emit('end')
  })

  duplex.on('end', async () => {
    console.log(data)

    const [command, ...params] = data.split(' ')
    const [a, b] = params.map(Number)
    const { x, y } = robot.getMousePos()

    if (command === 'mouse_up') {
      robot.moveMouse(x, y - a)
    } else if (command === 'mouse_down') {
      robot.moveMouse(x, y + a)
    } else if (command === 'mouse_left') {
      robot.moveMouse(x - a, y)
    } else if (command === 'mouse_right') {
      robot.moveMouse(x + a, y)
    } else if (command === 'mouse_position') {
      duplex.write(`mouse_position ${x},${y}`)
    } else if (command === 'prnt_scrn') {
      const image = await printScreen(x, y, 200, 200)
      const base64 = await image.getBase64Async(image.getMIME())
      duplex.write(`prnt_scrn ${base64.substring(22)}`)
    } else if (command === 'draw_square') {
      drawLine(x, y, a)
    } else if (command === 'draw_rectangle') {
      drawLine(x, y, a, b)
    } else if (command === 'draw_circle') {
      drawCircle(x, y, a)
    }

    data = ''
  })
})
