import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu'
import {DOCUMENT} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  viewChild,
} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav'
import {Router, RouterLink, RouterOutlet} from '@angular/router'
import {SelectDirective} from '../../directives/select.directive'
import {LOGIN_PATH} from '../../guards/session.guards'
import {errorAlreadyReported} from '../../interceptors/http-error.interceptor'
import {AuthService} from '../../services/auth.service'
import {BoardStore} from '../../state/board.store'
import {UserStore} from '../../state/user.store'

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
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    RouterLink,
    RouterOutlet,
  ],
})
export class WorkspaceComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  protected readonly userStore = inject(UserStore)
  protected readonly boardStore = inject(BoardStore)
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('search')

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

  @HostListener('document:keydown', ['$event'])
  onSearchShortcut(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      const search = this.searchInput()?.nativeElement
      search?.focus()
      search?.select()
    }
  }

  clearSearch(input: HTMLInputElement) {
    input.value = ''
    this.boardStore.setSearch('')
    input.blur()
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

  deleteBoard(boardId: string) {
    this.userStore.deleteBoard(boardId)
    if (this.boardStore.board()?.id === boardId) {
      void this.router.navigate(['/'])
    }
  }
}
