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
  signal,
  viewChild,
} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router'
import {SelectDirective} from '../../directives/select.directive'
import {LOGIN_PATH} from '../../guards/session.guards'
import {TASK_COLORS} from '../../models/task'
import {User} from '../../models/user'
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
  imports: [MatIcon, SelectDirective, CdkMenuTrigger, CdkMenu, CdkMenuItem, RouterLink, RouterLinkActive, RouterOutlet],
})
export class WorkspaceComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  protected readonly userStore = inject(UserStore)
  protected readonly boardStore = inject(BoardStore)
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('search')
  protected readonly filtersOpen = signal(false)
  protected readonly taskColors = TASK_COLORS
  protected readonly accountLabel = $localize`:@@account.menu:Аккаунт`

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
    } else if (event.key === 'Escape') {
      this.filtersOpen.set(false)
    }
  }

  @HostListener('document:click')
  closeFilters() {
    this.filtersOpen.set(false)
  }

  toggleFilters(event: Event) {
    event.stopPropagation()
    this.filtersOpen.update(open => !open)
  }

  initials(user: User): string {
    const letters = [user.firstname, user.lastname]
      .map(part => part?.trim() ?? '')
      .filter(part => part.length > 0)
      .map(part => part[0])
    return (letters.join('') || user.email.slice(0, 2)).toLocaleUpperCase('ru')
  }

  clearSearch(input: HTMLInputElement) {
    input.value = ''
    this.boardStore.setSearch('')
    input.blur()
  }

  logout() {
    this.auth.logout().subscribe()
  }

  renameBoard(boardId: string, name: string) {
    this.userStore.renameBoard(boardId, name)
    this.boardStore.setName(name)
  }
}
