import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {provideZonelessChangeDetection} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {isSaved} from '../models/entity'
import {makeBoard, makeColumn} from '../testing/fixtures'
import {BoardStore} from './board.store'

describe('BoardStore', () => {
  let store: BoardStore
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    })
    store = TestBed.inject(BoardStore)
    httpMock = TestBed.inject(HttpTestingController)
    store.show({board: makeBoard('board-1', 'Доска', [makeColumn('column-1', 'Колонка')]), etag: null})
  })

  afterEach(() => httpMock.verify())

  const localColumn = () => store.board()!.columns.find(column => !isSaved(column))!

  it('creates a new column once and renames it to the latest name after creation', () => {
    store.addColumn()
    const localId = localColumn().id

    store.renameColumn(localId, 'Первое')
    store.renameColumn(localId, 'Второе')

    const create = httpMock.expectOne({method: 'POST', url: '/api/v1/boards/board-1/columns'})
    expect(create.request.body).toEqual({name: 'Первое'})
    create.flush(makeColumn('column-2', 'Первое'))

    const rename = httpMock.expectOne({method: 'PATCH', url: '/api/v1/columns/column-2'})
    expect(rename.request.body).toEqual({name: 'Второе'})
    rename.flush(null)
    expect(store.board()!.columns.map(column => [column.id, column.name])).toEqual([
      ['column-1', 'Колонка'],
      ['column-2', 'Второе'],
    ])
  })

  it('deletes on the server a column that was removed while it was being created', () => {
    store.addColumn()
    const localId = localColumn().id
    store.renameColumn(localId, 'Временная')
    store.deleteColumn(localId)

    httpMock.expectOne('/api/v1/boards/board-1/columns').flush(makeColumn('column-2', 'Временная'))

    httpMock.expectOne({method: 'DELETE', url: '/api/v1/columns/column-2'}).flush(null)
    expect(store.board()!.columns.map(column => column.id)).toEqual(['column-1'])
  })

  it('does not create a task until its column is saved', () => {
    store.addColumn()
    const columnId = localColumn().id
    store.addTask(columnId)
    const taskId = localColumn().tasks[0].id

    store.renameTask(taskId, 'Задача')

    httpMock.expectNone(req => req.url.endsWith('/tasks'))
    expect(localColumn().tasks[0].name).toBe('Задача')
  })

  it('restores the board from the server when a change is rejected', () => {
    store.renameColumn('column-1', 'Не сохранится')
    httpMock
      .expectOne({method: 'PATCH', url: '/api/v1/columns/column-1'})
      .flush(null, {status: 500, statusText: 'Server Error'})

    httpMock
      .expectOne({method: 'GET', url: '/api/v1/boards/board-1'})
      .flush(makeBoard('board-1', 'Доска', [makeColumn('column-1', 'Колонка')]))

    expect(store.board()!.columns[0].name).toBe('Колонка')
  })

  it('keeps on the server a column whose creation finished after another board was opened', () => {
    store.addColumn()
    store.renameColumn(localColumn().id, 'Новая')
    const create = httpMock.expectOne('/api/v1/boards/board-1/columns')

    store.open('board-2')
    httpMock.expectOne('/api/v1/boards/board-2').flush(makeBoard('board-2', 'Другая доска'))
    create.flush(makeColumn('column-2', 'Новая'))

    httpMock.expectNone({method: 'DELETE'})
    expect(store.board()!.id).toBe('board-2')
  })

  it('ignores a board that finished loading after another board was opened', () => {
    store.open('board-2')
    const slow = httpMock.expectOne('/api/v1/boards/board-2')
    store.open('board-3')
    httpMock.expectOne('/api/v1/boards/board-3').flush(makeBoard('board-3', 'Третья'))

    slow.flush(makeBoard('board-2', 'Вторая'))

    expect(store.board()!.id).toBe('board-3')
  })

  it('connects the drop lists of all columns and tasks and keeps them stable on unrelated changes', () => {
    store.addTask('column-1')
    const taskId = store.board()!.columns[0].tasks[0].id
    const taskListIds = store.taskListIds()

    store.renameColumn('column-1', 'Колонка 2')
    httpMock.expectOne({method: 'PATCH', url: '/api/v1/columns/column-1'}).flush(null)

    expect(store.taskListIds()).toBe(taskListIds)
    expect(taskListIds).toEqual(['tasks-of-column-1'])
    expect(store.subtaskListIds()).toEqual([`subtasks-of-${taskId}`])

    store.addColumn()
    expect(store.taskListIds()).toEqual(['tasks-of-column-1', `tasks-of-${localColumn().id}`])
  })
})
