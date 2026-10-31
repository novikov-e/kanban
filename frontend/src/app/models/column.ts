import {newLocalId} from './entity'
import {Task} from './task'

export interface Column {
  readonly id: string
  readonly name: string
  readonly tasks: readonly Task[]
}

export function newColumn(): Column {
  return {id: newLocalId(), name: '', tasks: []}
}
