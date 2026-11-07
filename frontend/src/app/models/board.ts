import {Column} from './column'

/** Имя, которое сервер даёт новой доске (DEFAULT_BOARD_NAME в board_service); не переводится. */
export const NEW_BOARD_NAME = 'Новая доска'

/** Доска в списке пользователя, без содержимого. */
export interface BoardSummary {
  readonly id: string
  readonly name: string
}

export interface Board extends BoardSummary {
  readonly columns: readonly Column[]
}
