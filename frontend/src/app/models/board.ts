import {Column} from './column'

export const NEW_BOARD_NAME = 'Новый проект'

/** Проект в списке пользователя, без содержимого. */
export interface BoardSummary {
  readonly id: string
  readonly name: string
}

export interface Board extends BoardSummary {
  readonly columns: readonly Column[]
}
