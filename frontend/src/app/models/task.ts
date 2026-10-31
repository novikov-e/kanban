import {newLocalId} from './entity'
import {Subtask} from './subtask'

export const DEFAULT_TASK_COLOR = 1

/** Цвета задач; значение — номер цвета палитры (--task-color-N в styles.css). */
export const TASK_COLORS: readonly {value: number; name: string}[] = [
  {value: 1, name: 'Основной'},
  {value: 2, name: 'Красный'},
  {value: 3, name: 'Розовый'},
  {value: 4, name: 'Оранжевый'},
  {value: 5, name: 'Зелёный'},
  {value: 6, name: 'Сине-зелёный'},
  {value: 7, name: 'Синий'},
  {value: 8, name: 'Фиолетовый'},
]

export interface Task {
  readonly id: string
  readonly name: string
  /** Индекс цвета в палитре темы. */
  readonly color: number
  readonly subtasks: readonly Subtask[]
}

export function newTask(): Task {
  return {id: newLocalId(), name: '', color: DEFAULT_TASK_COLOR, subtasks: []}
}
