import { httpServer } from './http_server/index'
import { createWebSocketStream, WebSocketServer } from 'ws'
import app from './app'
import { TCommand } from './types/command'

const HTTP_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', async (ws) => {
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
        duplex.write(error.message)
      }
    } finally {
      data = ''
    }
  })
})
