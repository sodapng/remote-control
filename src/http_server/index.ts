import { createReadStream } from 'fs'
import { createServer } from 'http'
import { dirname, resolve } from 'path'
import { pipeline } from 'stream/promises'

export const httpServer = createServer(async (req, res) => {
  try {
    const __dirname = resolve(dirname(''))
    const file_path =
      __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url)

    const rs = createReadStream(file_path)

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    })

    await pipeline(rs, res)
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(error))
  }
})
