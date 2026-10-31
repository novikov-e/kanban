import {Board} from '../models/board'
import {Column} from '../models/column'

export const makeBoard = (id: string, name: string, columns: readonly Column[] = []): Board => ({id, name, columns})

export const makeColumn = (id: string, name: string): Column => ({id, name, tasks: []})
