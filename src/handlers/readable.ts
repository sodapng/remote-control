import { Duplex } from 'stream'
import app from '../app'

export default function readable(duplex: Duplex) {
  let data = ''

  return async () => {
    try {
      let chunk

      while (null !== (chunk = duplex.read())) {
        data += chunk
      }

      const [command, ...params] = data.split(' ')
      const [x, y] = params.map(Number)

      const runCommand = app()

      const isValidCommand = Object.prototype.hasOwnProperty.call(
        runCommand,
        command
      )

      if (!isValidCommand) {
        throw new Error(`${command} command not found`)
      }

      console.log(`got a message: ${data}`)
      const result = await runCommand[command](x, y)
      duplex.write(`${command} ${result}\0`)
      console.log(`sent a message: ${command} ${result ? result : ''}\0`)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    } finally {
      data = ''
    }
  }
}
