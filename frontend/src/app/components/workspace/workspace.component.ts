import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {DOCUMENT} from '@angular/common'
import {ChangeDetectionStrategy, Component, DestroyRef, effect, inject} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav'
import {Router, RouterLink, RouterOutlet} from '@angular/router'
import {SelectDirective} from '../../directives/select.directive'
import {LOGIN_PATH} from '../../guards/session.guards'
import {errorAlreadyReported} from '../../interceptors/http-error.interceptor'
import {BoardSummary} from '../../models/board'
import {AuthService} from '../../services/auth.service'
import {BoardStore} from '../../state/board.store'
import {UserStore} from '../../state/user.store'
import {isNoopDrop} from '../../utils/drag-drop'

/** Класс на <html>, переключающий палитру в styles.css. */
const DARK_THEME_CLASS = 'theme-dark'

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    MatInput,
    SelectDirective,
    MatDrawerContainer,
    MatDrawer,
    CdkDropList,
    CdkDrag,
    RouterLink,
    RouterOutlet,
  ],
})
export class WorkspaceComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  protected readonly userStore = inject(UserStore)
  protected readonly boardStore = inject(BoardStore)

  constructor() {
    effect(() => {
      if (!this.auth.isAuthenticated()) {
        void this.router.navigate([LOGIN_PATH])
      }
    })
    const root = inject(DOCUMENT).documentElement
    effect(() => root.classList.toggle(DARK_THEME_CLASS, this.userStore.user()?.darkTheme === true))
    inject(DestroyRef).onDestroy(() => {
      root.classList.remove(DARK_THEME_CLASS)
      this.userStore.clear()
    })
  }

  logout() {
    this.auth.logout().subscribe()
  }

  createBoard() {
    this.userStore.createBoard().subscribe({
      next: board => {
        this.boardStore.show({board, etag: null})
        void this.router.navigate(['/boards', board.id])
      },
      error: errorAlreadyReported,
    })
  }

  closeBoard() {
    this.userStore.rememberLastBoard(null)
    void this.router.navigate(['/'])
  }

  renameBoard(boardId: string, name: string) {
    this.userStore.renameBoard(boardId, name)
    this.boardStore.setName(name)
  }

  onBoardDrop(event: CdkDragDrop<readonly BoardSummary[]>) {
    if (!isNoopDrop(event)) {
      this.userStore.moveBoard(event.previousIndex, event.currentIndex)
    }
  }

  deleteBoard(boardId: string) {
    this.userStore.deleteBoard(boardId)
    if (this.boardStore.board()?.id === boardId) {
      void this.router.navigate(['/'])
    }
  }
}
