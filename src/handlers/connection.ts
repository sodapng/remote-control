import { createWebSocketStream } from 'ws'
import heartbeat from '../helpers/heartbeat'
import { TWebSocket } from '../types'
import readable from './readable'

export function connection() {
  return async (ws: TWebSocket) => {
    ws.isAlive = true

    ws.on('pong', heartbeat)

    ws.on('close', () => {
      duplex.destroy()
    })

    const duplex = createWebSocketStream(ws, {
      encoding: 'utf8',
      decodeStrings: false,
    })

    duplex.on('readable', readable(duplex))
  }
}