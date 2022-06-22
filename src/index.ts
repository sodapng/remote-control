import * as dotenv from 'dotenv'
import { httpServer } from './http_server/index'
import { createWebSocketStream, WebSocketServer } from 'ws'
import app from './app'
import heartbeat from './helpers/heartbeat'
import { TCommand, TWebSocket } from './types'
import { interval } from './helpers/interval'
import { resolve } from 'path'
import { cwd } from 'process'

dotenv.config({ path: resolve(cwd(), '.env') })

const HTTP_PORT = process.env.HTTP_PORT || 3000
const WSS_PORT = Number(process.env.WSS_PORT) || 8080

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

export const wss = new WebSocketServer({ port: WSS_PORT })

wss.on('connection', async (ws: TWebSocket) => {
  ws.isAlive = true

  ws.on('pong', heartbeat)

  ws.on('close', () => {
    duplex.destroy()
  })

  const duplex = createWebSocketStream(ws, {
    encoding: 'utf8',
    decodeStrings: false,
  })

  let data = ''

  duplex.on('readable', async () => {
    try {
      let chunk

      while (null !== (chunk = duplex.read())) {
        data += chunk
      }

      const [command, ...params] = data.split(' ') as [TCommand]
      const [x, y] = params.map(Number)

      const runCommand = app()

      const isValidCommand = Object.prototype.hasOwnProperty.call(
        runCommand,
        command
      )

      if (!isValidCommand) {
        throw new Error(`${command} command not found`)
      }

      console.log(command, ...params)
      const result = await runCommand[command](x, y)
      duplex.write(`${command} ${result}`)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    } finally {
      data = ''
    }
  })
})

wss.on('close', () => {
  clearInterval(interval)
})
