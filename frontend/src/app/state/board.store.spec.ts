import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {provideZonelessChangeDetection} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {Board} from '../models/board'
import {Column} from '../models/column'
import {isSaved} from '../models/entity'
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
    const board = new Board('board-1', 'Доска', 1)
    board.columns = [new Column('column-1', 'Колонка', 1)]
    store.show({board, etag: null})
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
    create.flush(new Column('column-2', 'Первое', 2))

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

    httpMock.expectOne('/api/v1/boards/board-1/columns').flush(new Column('column-2', 'Временная', 2))

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
})
