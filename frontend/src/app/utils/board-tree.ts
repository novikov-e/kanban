import {Board} from '../models/board'
import {Column} from '../models/column'
import {Subtask} from '../models/subtask'
import {Task} from '../models/task'

type Change<T> = (item: T) => T

export function insertAt<T>(items: readonly T[], index: number, item: T): T[] {
  return [...items.slice(0, index), item, ...items.slice(index)]
}

export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const rest = items.filter((_, index) => index !== from)
  return insertAt(rest, to, items[from])
}

export function findColumn(board: Board, columnId: string): Column | undefined {
  return board.columns.find(column => column.id === columnId)
}

export function findTask(board: Board, taskId: string): Task | undefined {
  return board.columns.flatMap(column => column.tasks).find(task => task.id === taskId)
}

export function findSubtask(board: Board, subtaskId: string): Subtask | undefined {
  return allTasks(board)
    .flatMap(task => task.subtasks)
    .find(subtask => subtask.id === subtaskId)
}

export function findColumnOfTask(board: Board, taskId: string): Column | undefined {
  return board.columns.find(column => hasTask(column, taskId))
}

export function findTaskOfSubtask(board: Board, subtaskId: string): Task | undefined {
  return allTasks(board).find(task => hasSubtask(task, subtaskId))
}

export function updateColumn(board: Board, columnId: string, change: Change<Column>): Board {
  return {...board, columns: replaceWhere(board.columns, column => column.id === columnId, change)}
}

export function updateTask(board: Board, taskId: string, change: Change<Task>): Board {
  return updateColumnsWhere(
    board,
    column => hasTask(column, taskId),
    column => ({...column, tasks: replaceWhere(column.tasks, task => task.id === taskId, change)}),
  )
}

export function updateSubtask(board: Board, subtaskId: string, change: Change<Subtask>): Board {
  return updateTasksWhere(
    board,
    task => hasSubtask(task, subtaskId),
    task => ({...task, subtasks: replaceWhere(task.subtasks, subtask => subtask.id === subtaskId, change)}),
  )
}

export function removeColumn(board: Board, columnId: string): Board {
  return {...board, columns: board.columns.filter(column => column.id !== columnId)}
}

export function removeTask(board: Board, taskId: string): Board {
  return updateColumnsWhere(
    board,
    column => hasTask(column, taskId),
    column => ({...column, tasks: column.tasks.filter(task => task.id !== taskId)}),
  )
}

export function removeSubtask(board: Board, subtaskId: string): Board {
  return updateTasksWhere(
    board,
    task => hasSubtask(task, subtaskId),
    task => ({...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)}),
  )
}

export function moveColumn(board: Board, columnId: string, index: number): Board {
  const column = findColumn(board, columnId)
  return column ? {...board, columns: insertAt(removeColumn(board, columnId).columns, index, column)} : board
}

export function moveTask(board: Board, taskId: string, columnId: string, index: number): Board {
  const task = findTask(board, taskId)
  if (!task) {
    return board
  }
  return updateColumn(removeTask(board, taskId), columnId, column => ({
    ...column,
    tasks: insertAt(column.tasks, index, task),
  }))
}

export function moveSubtask(board: Board, subtaskId: string, taskId: string, index: number): Board {
  const subtask = findSubtask(board, subtaskId)
  if (!subtask) {
    return board
  }
  return updateTask(removeSubtask(board, subtaskId), taskId, task => ({
    ...task,
    subtasks: insertAt(task.subtasks, index, subtask),
  }))
}

function allTasks(board: Board): Task[] {
  return board.columns.flatMap(column => column.tasks)
}

function hasTask(column: Column, taskId: string): boolean {
  return column.tasks.some(task => task.id === taskId)
}

function hasSubtask(task: Task, subtaskId: string): boolean {
  return task.subtasks.some(subtask => subtask.id === subtaskId)
}

function replaceWhere<T>(items: readonly T[], matches: (item: T) => boolean, change: Change<T>): T[] {
  return items.map(item => (matches(item) ? change(item) : item))
}

function updateColumnsWhere(board: Board, matches: (column: Column) => boolean, change: Change<Column>): Board {
  return {...board, columns: replaceWhere(board.columns, matches, change)}
}

function updateTasksWhere(board: Board, matches: (task: Task) => boolean, change: Change<Task>): Board {
  return updateColumnsWhere(
    board,
    column => column.tasks.some(matches),
    column => ({...column, tasks: replaceWhere(column.tasks, matches, change)}),
  )
}
