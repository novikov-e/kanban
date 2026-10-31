import {Board} from '../models/board'
import {Column} from '../models/column'
import {Task} from '../models/task'
import {makeBoard} from '../testing/fixtures'
import {moveColumn, moveItem, moveSubtask, moveTask, removeTask, updateTask} from './board-tree'

const task = (id: string, subtaskIds: string[] = []): Task => ({
  id,
  name: id,
  color: 1,
  subtasks: subtaskIds.map(subtaskId => ({id: subtaskId, name: subtaskId, state: false})),
})
const column = (id: string, tasks: Task[]): Column => ({id, name: id, tasks})

const ids = (items: readonly {id: string}[]) => items.map(item => item.id)
const taskIds = (board: Board) => board.columns.map(item => ids(item.tasks))

describe('board tree', () => {
  const board = makeBoard('board', 'Доска', [
    column('first', [task('a', ['a1', 'a2']), task('b')]),
    column('second', [task('c', ['c1'])]),
  ])

  it('moves an item to its final index, like the drop list reports it', () => {
    expect(moveItem(['A', 'B', 'C', 'D'], 0, 2)).toEqual(['B', 'C', 'A', 'D'])
    expect(moveItem(['A', 'B', 'C', 'D'], 3, 0)).toEqual(['D', 'A', 'B', 'C'])
  })

  it('moves columns, tasks and subtasks between parents', () => {
    expect(ids(moveColumn(board, 'second', 0).columns)).toEqual(['second', 'first'])
    expect(taskIds(moveTask(board, 'a', 'second', 1))).toEqual([['b'], ['c', 'a']])

    const moved = moveSubtask(board, 'a2', 'c', 0)
    expect(moved.columns[0].tasks[0].subtasks.map(item => item.id)).toEqual(['a1'])
    expect(moved.columns[1].tasks[0].subtasks.map(item => item.id)).toEqual(['a2', 'c1'])
  })

  it('does not change the original tree', () => {
    const snapshot = structuredClone(board)

    moveTask(board, 'a', 'second', 0)
    removeTask(board, 'b')
    updateTask(board, 'c', item => ({...item, name: 'Переименован'}))

    expect(board).toEqual(snapshot)
  })

  it('keeps untouched branches by reference so OnPush components skip them', () => {
    const renamed = updateTask(board, 'c', item => ({...item, name: 'Переименован'}))

    expect(renamed).not.toBe(board)
    expect(renamed.columns[0]).toBe(board.columns[0])
    expect(renamed.columns[1]).not.toBe(board.columns[1])
    expect(renamed.columns[1].tasks[0].name).toBe('Переименован')
  })

  it('ignores moves of unknown items', () => {
    expect(moveTask(board, 'missing', 'second', 0)).toBe(board)
    expect(moveSubtask(board, 'missing', 'c', 0)).toBe(board)
  })
})
