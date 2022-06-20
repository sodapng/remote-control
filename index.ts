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
  })
})
