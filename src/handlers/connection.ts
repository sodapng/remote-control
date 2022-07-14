import { IncomingMessage } from 'http'
import { createWebSocketStream } from 'ws'
import { IWebSocket } from '../types'
import readable from './readable'

export function connection() {
  return async (ws: IWebSocket, req: IncomingMessage) => {
    const user = `${req.socket.remoteAddress}:${req.socket.remotePort}`
    console.log(`New connection: ${user}`)

    ws.on('close', () => {
      console.log(`User ${user} is out`)
      duplex.destroy()
    })

    ws.isAlive = true

    ws.on('pong', () => {
      ws.isAlive = true
    })

    const duplex = createWebSocketStream(ws, {
      encoding: 'utf8',
      decodeStrings: false,
    })

    duplex.on('readable', readable(duplex))
  }
}
