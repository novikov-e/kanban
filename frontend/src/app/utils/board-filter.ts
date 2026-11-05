import {Board} from '../models/board'
import {Column} from '../models/column'
import {Task} from '../models/task'

/** Оставляет колонки и списки, где совпали текст и выбранные цвета. Пустое название не скрывается: его ещё вводят. */
export function filterBoard(board: Board, query: string, colors: readonly number[] = []): Board {
  const needle = query.trim().toLocaleLowerCase('ru')
  const selected = new Set(colors)
  if (!needle && selected.size === 0) {
    return board
  }
  return {
    ...board,
    columns: board.columns
      .filter(column => columnVisible(column, needle, selected))
      .map(column => ({...column, tasks: column.tasks.filter(task => taskVisible(task, needle, selected))})),
  }
}

function columnVisible(column: Column, needle: string, colors: ReadonlySet<number>): boolean {
  return column.name.trim() === '' || column.tasks.some(task => taskVisible(task, needle, colors))
}

function taskVisible(task: Task, needle: string, colors: ReadonlySet<number>): boolean {
  if (task.name.trim() === '') {
    return true
  }
  if (colors.size > 0 && !colors.has(task.color)) {
    return false
  }
  return !needle || includes(task.name, needle) || task.subtasks.some(subtask => includes(subtask.name, needle))
}

function includes(text: string, needle: string): boolean {
  return text.toLocaleLowerCase('ru').includes(needle)
}
