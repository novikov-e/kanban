import {newLocalId} from './entity'

export interface Subtask {
  readonly id: string
  readonly name: string
  readonly state: boolean
}

export function newSubtask(): Subtask {
  return {id: newLocalId(), name: '', state: false}
}
