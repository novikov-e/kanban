import {newLocalId} from './entity'
import {Subtask} from './subtask'

export const DEFAULT_TASK_COLOR = 1

/** Цвета задач; значение — номер цвета палитры (--task-color-N в styles.css). */
export const TASK_COLORS: readonly {value: number; name: string}[] = [
  {value: 1, name: $localize`:@@color.main:Основной`},
  {value: 2, name: $localize`:@@color.red:Красный`},
  {value: 3, name: $localize`:@@color.pink:Розовый`},
  {value: 4, name: $localize`:@@color.orange:Оранжевый`},
  {value: 5, name: $localize`:@@color.green:Зелёный`},
  {value: 6, name: $localize`:@@color.teal:Сине-зелёный`},
  {value: 7, name: $localize`:@@color.blue:Синий`},
  {value: 8, name: $localize`:@@color.purple:Фиолетовый`},
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
