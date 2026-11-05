import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {Router, RouterLink} from '@angular/router'
import {errorAlreadyReported} from '../../interceptors/http-error.interceptor'
import {UserStore} from '../../state/user.store'

@Component({
  selector: 'app-boards-page',
  templateUrl: './boards-page.component.html',
  styleUrl: './boards-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, RouterLink],
})
export class BoardsPageComponent {
  private readonly router = inject(Router)
  protected readonly userStore = inject(UserStore)

  protected create(): void {
    this.userStore.createBoard().subscribe({
      next: board => void this.router.navigate(['/boards', board.id]),
      error: errorAlreadyReported,
    })
  }

  protected rename(boardId: string, name: string): void {
    const trimmed = name.trim()
    if (trimmed) {
      this.userStore.renameBoard(boardId, trimmed)
    }
  }

  protected remove(boardId: string): void {
    this.userStore.deleteBoard(boardId)
  }
}
