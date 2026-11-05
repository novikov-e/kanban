import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  input,
  untracked,
} from '@angular/core'
import {BoardStore} from '../../state/board.store'
import {UserStore} from '../../state/user.store'
import {BoardComponent} from '../board/board.component'

@Component({
  selector: 'app-board-page',
  template: `
    @if (boardStore.visibleBoard(); as board) {
      <app-board [board]="board"></app-board>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardComponent],
})
export class BoardPageComponent {
  protected readonly boardStore = inject(BoardStore)
  protected readonly userStore = inject(UserStore)

  readonly boardId = input.required<string>()

  constructor() {
    effect(() => {
      const boardId = this.boardId()
      untracked(() => this.boardStore.open(boardId))
    })
    const loadedBoardId = computed(() => this.boardStore.board()?.id)
    effect(() => {
      const boardId = loadedBoardId()
      if (boardId) {
        untracked(() => this.userStore.rememberLastBoard(boardId))
      }
    })
    inject(DestroyRef).onDestroy(() => this.boardStore.close())
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.boardStore.sync()
    }
  }
}
