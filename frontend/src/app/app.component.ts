import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop'
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav'
import {BoardComponent} from './components/board/board.component'
import {darkTheme} from './data/dark-theme'
import {lightTheme} from './data/light-theme'
import {SelectDirective} from './directives/select.directive'
import {TextButtonDirective} from './directives/text-button.directive'
import {Board} from './models/board'
import {Colors} from './models/colors'
import {Column} from './models/column'
import {UNSAVED_ID} from './models/entity'
import {User} from './models/user'
import {BoardService} from './services/board.service'
import {UserService} from './services/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  ],
})
export class AppComponent implements OnInit {
  private userService = inject(UserService)
  private boardService = inject(BoardService)

  user: User
  board: Board | null = null
  colors: Colors[] = lightTheme

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user
      this.colors = user.darkTheme ? darkTheme : lightTheme
      if (user.lastBoard !== null) {
        this.openBoard(user.lastBoard)
      }
    })
  }

  createBoard() {
    this.boardService.create(this.user.id).subscribe(board => {
      this.user.boards.push(board)
      this.board = board
      this.rememberLastBoard(board.id)
    })
  }

  openBoard(boardId: string) {
    if (this.board?.id === boardId) {
      return
    }
    this.board = null
    this.boardService.get(boardId).subscribe(board => (this.board = board))
    this.rememberLastBoard(boardId)
  }

  closeBoard() {
    this.board = null
    this.rememberLastBoard(null)
  }

  renameBoard(boardId: string, name: string) {
    const board = this.user.boards.find(userBoard => userBoard.id === boardId)
    if (board) {
      board.name = name
    }
    this.boardService.rename(boardId, name)
  }

  onBoardDrop(event: CdkDragDrop<Board[]>) {
    this.boardService.move(event.item.data.id, this.user.id, event.currentIndex)
    moveItemInArray(this.user.boards, event.previousIndex, event.currentIndex)
  }

  deleteBoard(boardId: string) {
    if (this.board?.id === boardId) {
      this.closeBoard()
    }
    this.boardService.delete(boardId)
    this.user.boards = this.user.boards.filter(board => board.id !== boardId)
  }

  addColumn() {
    this.board?.columns.push(new Column(UNSAVED_ID, '', this.board.columns.length))
  }

  toggleTheme() {
    this.user.darkTheme = !this.user.darkTheme
    this.colors = this.user.darkTheme ? darkTheme : lightTheme
    this.userService.setDarkTheme(this.user.id, this.user.darkTheme)
  }

  private rememberLastBoard(boardId: string | null) {
    this.user.lastBoard = boardId
    this.userService.setLastBoard(this.user.id, boardId)
  }
}
