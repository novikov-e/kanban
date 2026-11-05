import {Column} from '../models/column'
import {Subtask} from '../models/subtask'
import {Task} from '../models/task'
import {makeBoard} from '../testing/fixtures'
import {filterBoard} from './board-filter'
import {dropIndex} from './drag-drop'

const subtask = (id: string, name: string): Subtask => ({id, name, state: false})
const task = (id: string, name: string, subtasks: Subtask[] = [], color = 1): Task => ({
  id,
  name,
  color,
  subtasks,
})
const column = (id: string, name: string, tasks: Task[]): Column => ({id, name, tasks})

describe('filterBoard', () => {
  const board = makeBoard('board', 'Доска', [
    column('ideas', 'Идеи', [
      task('list', 'Простой список', [subtask('one', 'Первая задача'), subtask('two', 'Вторая')]),
    ]),
    column('colors', 'Цвета', [
      task('red', 'Красный список', [subtask('hot', 'Срочная')], 2),
      task('green', 'Зелёный', [], 5),
    ]),
    column('empty', 'Пустая', []),
  ])

  const names = (columns: readonly Column[]) => columns.map(item => [item.name, item.tasks.map(task => task.name)])

  it('returns the board unchanged when the query is blank', () => {
    expect(filterBoard(board, '   ')).toBe(board)
  })

  it('keeps a list and its column when the list name matches and hides the rest', () => {
    const found = filterBoard(board, 'красный')

    expect(names(found.columns)).toEqual([['Цвета', ['Красный список']]])
    expect(found.columns[0].tasks[0].subtasks.map(item => item.name)).toEqual(['Срочная'])
  })

  it('keeps the whole list when a task inside it matches', () => {
    const found = filterBoard(board, 'ПЕРВАЯ')

    expect(names(found.columns)).toEqual([['Идеи', ['Простой список']]])
    expect(found.columns[0].tasks[0].subtasks).toHaveLength(2)
  })

  it('keeps only lists of the selected colors', () => {
    expect(names(filterBoard(board, '', [2]).columns)).toEqual([['Цвета', ['Красный список']]])
  })

  it('combines the text query with the color', () => {
    expect(names(filterBoard(board, 'зел', [5]).columns)).toEqual([['Цвета', ['Зелёный']]])
    expect(names(filterBoard(board, 'зелёный', [2]).columns)).toEqual([])
  })

  it('keeps a column or list that is still being named', () => {
    const naming = makeBoard('board', 'Доска', [
      column('draft', '', [task('kept', 'Не совпадает')]),
      column('named', 'Колонка', [task('fresh', ''), task('other', 'Другое')]),
    ])

    expect(names(filterBoard(naming, 'нет').columns)).toEqual([
      ['', []],
      ['Колонка', ['']],
    ])
  })
})

describe('dropIndex', () => {
  const items = ['A', 'B', 'C', 'D', 'E'].map(id => ({id}))

  it('matches the unfiltered drop index', () => {
    const visible = items.map(item => item.id)

    expect(dropIndex(items, visible, 'A', 2)).toBe(2)
    expect(dropIndex(items, visible, 'D', 1)).toBe(1)
    expect(dropIndex(items, visible, 'A', 4)).toBe(4)
  })

  it('places the item among hidden neighbours so the visible order follows the drop', () => {
    const visible = ['B', 'D']

    expect(dropIndex(items, visible, 'A', 1)).toBe(2)
    expect(dropIndex(items, visible, 'B', 1)).toBe(3)
    expect(dropIndex(items, visible, 'X', 1)).toBe(3)
  })
})
