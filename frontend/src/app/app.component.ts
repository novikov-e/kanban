import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav'
import {finalize} from 'rxjs'
import {BoardComponent} from './components/board/board.component'
import {LoginComponent} from './components/login/login.component'
import {SelectDirective} from './directives/select.directive'
import {TextButtonDirective} from './directives/text-button.directive'
import {errorAlreadyReported} from './interceptors/http-error.interceptor'
import {Board} from './models/board'
import {AuthService} from './services/auth.service'
import {BoardStore} from './state/board.store'
import {UserStore} from './state/user.store'
import {isNoopDrop} from './utils/drag-drop'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TextButtonDirective,
    MatIcon,
    MatInput,
    SelectDirective,
    MatDrawerContainer,
    MatDrawer,
    CdkDropList,
    CdkDrag,
    BoardComponent,
    LoginComponent,
  ],
})
export class AppComponent implements OnInit {
  protected readonly auth = inject(AuthService)
  protected readonly userStore = inject(UserStore)
  protected readonly boardStore = inject(BoardStore)
  protected readonly sessionChecked = signal(false)

  ngOnInit(): void {
    this.auth.refresh().subscribe({
      next: () => this.loadUser(),
      error: () => this.sessionChecked.set(true),
    })
  }

  loadUser() {
    this.userStore
      .load()
      .pipe(finalize(() => this.sessionChecked.set(true)))
      .subscribe({
        next: user => {
          if (user.lastBoard !== null) {
            this.boardStore.open(user.lastBoard)
          }
        },
        error: errorAlreadyReported,
      })
  }

  logout() {
    this.auth.logout().subscribe()
    this.boardStore.close()
    this.userStore.clear()
  }

  createBoard() {
    this.userStore.createBoard().subscribe({
      next: board => {
        this.boardStore.show({board, etag: null})
        this.userStore.rememberLastBoard(board.id)
      },
      error: errorAlreadyReported,
    })
  }

  openBoard(boardId: string) {
    if (this.boardStore.board()?.id !== boardId) {
      this.boardStore.open(boardId)
      this.userStore.rememberLastBoard(boardId)
    }
  }

  closeBoard() {
    this.boardStore.close()
    this.userStore.rememberLastBoard(null)
  }

  renameBoard(boardId: string, name: string) {
    this.userStore.renameBoard(boardId, name)
    this.boardStore.setName(name)
  }

  onBoardDrop(event: CdkDragDrop<Board[]>) {
    if (!isNoopDrop(event)) {
      this.userStore.moveBoard(event.previousIndex, event.currentIndex)
    }
  }

  deleteBoard(boardId: string) {
    if (this.boardStore.board()?.id === boardId) {
      this.boardStore.close()
    }
    this.userStore.deleteBoard(boardId)
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.boardStore.sync()
    }
  }
}
