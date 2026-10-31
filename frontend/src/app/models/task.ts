import {newLocalId} from './entity'
import {Subtask} from './subtask'

export const DEFAULT_TASK_COLOR = 1

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
