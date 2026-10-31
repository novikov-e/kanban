import {computed, inject, Injectable, signal} from '@angular/core'
import {Observable, tap} from 'rxjs'
import {darkTheme} from '../data/dark-theme'
import {lightTheme} from '../data/light-theme'
import {errorAlreadyReported} from '../interceptors/http-error.interceptor'
import {Board} from '../models/board'
import {User} from '../models/user'
import {BoardService} from '../services/board.service'
import {UserService} from '../services/user.service'
import {moveItem} from '../utils/board-tree'

@Injectable({providedIn: 'root'})
export class UserStore {
  private userService = inject(UserService)
  private boardService = inject(BoardService)

  private readonly state = signal<User | null>(null)

  readonly user = this.state.asReadonly()
  readonly colors = computed(() => (this.state()?.darkTheme ? darkTheme : lightTheme))

  load(): Observable<User> {
    return this.userService.getMe().pipe(tap(user => this.state.set(user)))
  }

  clear(): void {
    this.state.set(null)
  }

  createBoard(): Observable<Board> {
    return this.boardService
      .create()
      .pipe(tap(board => this.update(user => ({...user, boards: [...user.boards, board]}))))
  }

  renameBoard(boardId: string, name: string): void {
    this.update(user => ({
      ...user,
      boards: user.boards.map(board => (board.id === boardId ? {...board, name} : board)),
    }))
    this.send(this.boardService.rename(boardId, name))
  }

  moveBoard(from: number, to: number): void {
    const board = this.state()?.boards[from]
    if (!board) {
      return
    }
    this.update(user => ({...user, boards: moveItem(user.boards, from, to)}))
    this.send(this.boardService.move(board.id, to))
  }

  deleteBoard(boardId: string): void {
    this.update(user => ({
      ...user,
      lastBoard: user.lastBoard === boardId ? null : user.lastBoard,
      boards: user.boards.filter(board => board.id !== boardId),
    }))
    this.send(this.boardService.delete(boardId))
  }

  toggleTheme(): void {
    const darkTheme = !this.state()?.darkTheme
    this.update(user => ({...user, darkTheme}))
    this.send(this.userService.setDarkTheme(darkTheme))
  }

  rememberLastBoard(boardId: string | null): void {
    this.update(user => ({...user, lastBoard: boardId}))
    this.send(this.userService.setLastBoard(boardId))
  }

  private update(change: (user: User) => User): void {
    this.state.update(user => (user ? change(user) : user))
  }

  /** При ошибке возвращает пользователя к состоянию сервера, отменяя локальное изменение. */
  private send(request$: Observable<void>): void {
    request$.subscribe({error: () => this.load().subscribe({error: errorAlreadyReported})})
  }
}
