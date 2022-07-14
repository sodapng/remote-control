import * as dotenv from 'dotenv'
import { httpServer } from './http_server/index'
import { WebSocketServer } from 'ws'
import { interval } from './helpers/interval'
import { resolve } from 'path'
import { cwd } from 'process'
import { connection } from './handlers/connection'

dotenv.config({ path: resolve(cwd(), '.env') })

const HTTP_PORT = process.env.HTTP_PORT || 3000
const WSS_PORT = Number(process.env.WSS_PORT) || 8080

httpServer.listen(HTTP_PORT).on('listening', () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`)
})

export const wss = new WebSocketServer({ port: WSS_PORT })

wss.on('connection', connection())

wss.on('close', () => {
  clearInterval(interval)
})
