import {Board} from '../models/board'
import {Column} from '../models/column'
import {Task} from '../models/task'

/** Оставляет колонки и списки, в названии которых или в их задачах есть совпадение. */
export function filterBoard(board: Board, query: string): Board {
  const needle = query.trim().toLocaleLowerCase('ru')
  if (!needle) {
    return board
  }
  return {
    ...board,
    columns: board.columns
      .filter(column => columnVisible(column, needle))
      .map(column => ({...column, tasks: column.tasks.filter(task => taskVisible(task, needle))})),
  }
}

function columnVisible(column: Column, needle: string): boolean {
  return column.name.trim() === '' || column.tasks.some(task => taskVisible(task, needle))
}

function taskVisible(task: Task, needle: string): boolean {
  return (
    task.name.trim() === '' ||
    includes(task.name, needle) ||
    task.subtasks.some(subtask => subtask.name.trim() === '' || includes(subtask.name, needle))
  )
}

function includes(text: string, needle: string): boolean {
  return text.toLocaleLowerCase('ru').includes(needle)
}
