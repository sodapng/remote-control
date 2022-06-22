import { IWebSocket } from '../types'

export default function heartbeat(this: IWebSocket) {
  this.isAlive = true
}
