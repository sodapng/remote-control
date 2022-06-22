import { WebSocket } from 'ws'

export type TWebSocket = WebSocket & {
  isAlive: boolean
}

export type TCommand =
  | 'mouse_up'
  | 'mouse_down'
  | 'mouse_left'
  | 'mouse_right'
  | 'mouse_position'
  | 'prnt_scrn'
  | 'draw_square'
  | 'draw_rectangle'
  | 'draw_circle'
