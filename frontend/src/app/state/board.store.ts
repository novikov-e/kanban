import {computed, inject, Injectable, signal} from '@angular/core'
import {finalize, Observable} from 'rxjs'
import {Board} from '../models/board'
import {newColumn} from '../models/column'
import {Entity, hasUnsavedItems, isSaved} from '../models/entity'
import {newSubtask} from '../models/subtask'
import {newTask} from '../models/task'
import {errorAlreadyReported} from '../interceptors/http-error.interceptor'
import {BoardService, VersionedBoard} from '../services/board.service'
import {ColumnService} from '../services/column.service'
import {SubtaskService} from '../services/subtask.service'
import {TaskService} from '../services/task.service'
import {filterBoard} from '../utils/board-filter'
import * as tree from '../utils/board-tree'
import {sameItems, subtaskListId, taskListId} from '../utils/drag-drop'

/** Как сохранять название элемента одного уровня доски. */
interface NamedItems {
  /** null — родитель ещё не сохранён, создавать элемент рано. */
  create(localId: string, name: string): Observable<Entity> | null
  rename(id: string, name: string): Observable<void>
  remove(id: string): Observable<void>
  find(board: Board, id: string): {name: string} | undefined
  replaceId(board: Board, localId: string, id: string): Board
}

@Injectable({providedIn: 'root'})
export class BoardStore {
  private boardService = inject(BoardService)
  private columnService = inject(ColumnService)
  private taskService = inject(TaskService)
  private subtaskService = inject(SubtaskService)

  private readonly state = signal<Board | null>(null)
  private readonly searchState = signal('')
  private openBoardId: string | null = null
  private etag: string | null = null
  private readonly creating = new Set<string>()
  /** Элементы, удалённые пользователем, пока сервер их создавал. */
  private readonly discarded = new Set<string>()

  readonly board = this.state.asReadonly()
  readonly searchQuery = this.searchState.asReadonly()
  readonly hasSearch = computed(() => this.searchState().trim() !== '')

  /** Доска, которую видит пользователь: при поиске в ней только совпавшие колонки и списки. */
  readonly visibleBoard = computed(() => {
    const board = this.state()
    return board ? filterBoard(board, this.searchState()) : null
  })

  /**
   * id списков, между которыми перетаскиваются задачи и подзадачи. cdkDropListGroup не подходит:
   * вложенный cdkDropList сбрасывает группу для своих потомков. Берутся только видимые списки,
   * скрытые поиском колонки в разметке отсутствуют.
   */
  readonly taskListIds = computed(() => this.visibleBoard()?.columns.map(column => taskListId(column.id)) ?? [], {
    equal: sameItems,
  })
  readonly subtaskListIds = computed(
    () => this.visibleBoard()?.columns.flatMap(column => column.tasks.map(task => subtaskListId(task.id))) ?? [],
    {equal: sameItems},
  )

  setSearch(query: string): void {
    this.searchState.set(query)
  }

  open(boardId: string): void {
    if (this.openBoardId === boardId) {
      return
    }
    this.close()
    this.openBoardId = boardId
    this.searchState.set('')
    this.load(boardId)
  }

  show({board, etag}: VersionedBoard): void {
    this.openBoardId = board.id
    this.state.set(board)
    this.etag = etag
  }

  close(): void {
    this.openBoardId = null
    this.state.set(null)
    this.etag = null
    this.searchState.set('')
  }

  /** Подтягивает изменения из других вкладок; доску с несохранёнными элементами не трогает. */
  sync(): void {
    const board = this.state()
    if (!board || !this.etag || hasUnsavedItems(board)) {
      return
    }
    this.boardService.getIfChanged(board.id, this.etag).subscribe({
      next: changed => {
        if (changed && this.openBoardId === board.id) {
          this.show(changed)
        }
      },
      error: errorAlreadyReported,
    })
  }

  setName(name: string): void {
    this.update(board => ({...board, name}))
  }

  addColumn(): void {
    this.update(board => ({...board, columns: [...board.columns, newColumn()]}))
  }

  renameColumn(columnId: string, name: string): void {
    this.update(board => tree.updateColumn(board, columnId, column => ({...column, name})))
    this.saveName(this.columns, columnId, name)
  }

  moveColumn(columnId: string, index: number): void {
    const board = this.state()
    this.update(current => tree.moveColumn(current, columnId, index))
    if (board && isSaved({id: columnId})) {
      this.send(this.columnService.move(columnId, board.id, index))
    }
  }

  deleteColumn(columnId: string): void {
    this.update(board => tree.removeColumn(board, columnId))
    this.removeOnServer(this.columns, columnId)
  }

  addTask(columnId: string): void {
    const task = newTask()
    this.update(board => tree.updateColumn(board, columnId, column => ({...column, tasks: [...column.tasks, task]})))
  }

  renameTask(taskId: string, name: string): void {
    this.update(board => tree.updateTask(board, taskId, task => ({...task, name})))
    this.saveName(this.tasks, taskId, name)
  }

  changeTaskColor(taskId: string, color: number): void {
    this.update(board => tree.updateTask(board, taskId, task => ({...task, color})))
    if (isSaved({id: taskId})) {
      this.send(this.taskService.changeColor(taskId, color))
    }
  }

  moveTask(taskId: string, columnId: string, index: number): void {
    this.update(board => tree.moveTask(board, taskId, columnId, index))
    if (isSaved({id: taskId}) && isSaved({id: columnId})) {
      this.send(this.taskService.move(taskId, columnId, index))
    }
  }

  deleteTask(taskId: string): void {
    this.update(board => tree.removeTask(board, taskId))
    this.removeOnServer(this.tasks, taskId)
  }

  addSubtask(taskId: string): void {
    const subtask = newSubtask()
    this.update(board => tree.updateTask(board, taskId, task => ({...task, subtasks: [...task.subtasks, subtask]})))
  }

  renameSubtask(subtaskId: string, name: string): void {
    this.update(board => tree.updateSubtask(board, subtaskId, subtask => ({...subtask, name})))
    this.saveName(this.subtasks, subtaskId, name)
  }

  toggleSubtask(subtaskId: string): void {
    const board = this.state()
    const subtask = board && tree.findSubtask(board, subtaskId)
    if (!subtask) {
      return
    }
    const state = !subtask.state
    this.update(board => tree.updateSubtask(board, subtaskId, current => ({...current, state})))
    if (isSaved(subtask)) {
      this.send(this.subtaskService.changeState(subtaskId, state))
    }
  }

  moveSubtask(subtaskId: string, taskId: string, index: number): void {
    this.update(board => tree.moveSubtask(board, subtaskId, taskId, index))
    if (isSaved({id: subtaskId}) && isSaved({id: taskId})) {
      this.send(this.subtaskService.move(subtaskId, taskId, index))
    }
  }

  deleteSubtask(subtaskId: string): void {
    this.update(board => tree.removeSubtask(board, subtaskId))
    this.removeOnServer(this.subtasks, subtaskId)
  }

  private readonly columns: NamedItems = {
    create: (_, name) => this.columnService.create(this.state()!.id, name),
    rename: (id, name) => this.columnService.rename(id, name),
    remove: id => this.columnService.delete(id),
    find: tree.findColumn,
    replaceId: (board, localId, id) => tree.updateColumn(board, localId, column => ({...column, id})),
  }

  private readonly tasks: NamedItems = {
    create: (localId, name) => {
      const column = tree.findColumnOfTask(this.state()!, localId)
      return column && isSaved(column) ? this.taskService.create(column.id, name) : null
    },
    rename: (id, name) => this.taskService.rename(id, name),
    remove: id => this.taskService.delete(id),
    find: tree.findTask,
    replaceId: (board, localId, id) => tree.updateTask(board, localId, task => ({...task, id})),
  }

  private readonly subtasks: NamedItems = {
    create: (localId, name) => {
      const task = tree.findTaskOfSubtask(this.state()!, localId)
      return task && isSaved(task) ? this.subtaskService.create(task.id, name) : null
    },
    rename: (id, name) => this.subtaskService.rename(id, name),
    remove: id => this.subtaskService.delete(id),
    find: tree.findSubtask,
    replaceId: (board, localId, id) => tree.updateSubtask(board, localId, subtask => ({...subtask, id})),
  }

  /**
   * Сохраняет название: сохранённый элемент переименовывает, новый создаёт один раз.
   * Название, изменённое во время создания, отправляется переименованием после ответа сервера,
   * а элемент, удалённый во время создания, удаляется и на сервере.
   */
  private saveName(items: NamedItems, id: string, name: string): void {
    if (isSaved({id})) {
      this.send(items.rename(id, name))
      return
    }
    if (this.creating.has(id)) {
      return
    }
    const create$ = items.create(id, name)
    if (!create$) {
      return
    }
    const boardId = this.openBoardId
    this.creating.add(id)
    create$
      .pipe(
        finalize(() => {
          this.creating.delete(id)
          this.discarded.delete(id)
        }),
      )
      .subscribe({
        next: created => {
          if (this.discarded.has(id)) {
            this.send(items.remove(created.id))
            return
          }
          const board = this.state()
          const local = board && items.find(board, id)
          if (!local) {
            if (this.openBoardId === boardId) {
              this.reload()
            }
            return
          }
          this.update(current => items.replaceId(current, id, created.id))
          if (local.name !== name) {
            this.send(items.rename(created.id, local.name))
          }
        },
        error: () => this.reload(),
      })
  }

  private removeOnServer(items: NamedItems, id: string): void {
    if (isSaved({id})) {
      this.send(items.remove(id))
    } else if (this.creating.has(id)) {
      this.discarded.add(id)
    }
  }

  private load(boardId: string): void {
    this.boardService.get(boardId).subscribe({
      next: loaded => {
        if (this.openBoardId === boardId) {
          this.show(loaded)
        }
      },
      error: errorAlreadyReported,
    })
  }

  /** Возвращает доску к состоянию сервера: локальные изменения, которые не удалось сохранить, отбрасываются. */
  private reload(): void {
    if (this.openBoardId) {
      this.load(this.openBoardId)
    }
  }

  private update(change: (board: Board) => Board): void {
    this.state.update(board => (board ? change(board) : board))
  }

  private send(request$: Observable<void>): void {
    request$.subscribe({error: () => this.reload()})
  }
}
