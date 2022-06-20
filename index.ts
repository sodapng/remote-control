import Jimp from 'jimp'
import { httpServer } from './src/http_server/index'
import robot from 'robotjs'
import { createWebSocketStream, WebSocketServer } from 'ws'

const HTTP_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', async (ws) => {
  const duplex = createWebSocketStream(ws, {
    allowHalfOpen: false,
    encoding: 'utf8',
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
      ws.send(`mouse_position ${x},${y}`)
    } else if (command === 'prnt_scrn') {
      const { image, width, height } = robot.screen.capture(x, y, 200, 200)
      const jimp = await Jimp.create(width, height)
      jimp.bitmap.data = image
      const buffer = await jimp.getBase64Async(Jimp.MIME_PNG)
      ws.send(`prnt_scrn ${buffer.replace('data:image/png;base64,', '')}`)
    } else if (command === 'draw_square') {
      robot.mouseToggle('down')
      robot.dragMouse(x + a, y)
      robot.dragMouse(x + a, y + a)
      robot.dragMouse(x, y + a)
      robot.dragMouse(x, y)
      robot.mouseToggle('up')
    }

    data = ''
  })
})
