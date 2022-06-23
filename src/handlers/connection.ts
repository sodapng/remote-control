import { createWebSocketStream } from 'ws'
import { IWebSocket } from '../types'
import readable from './readable'

export function connection() {
  return async (ws: IWebSocket) => {
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
