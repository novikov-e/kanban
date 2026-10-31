import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Board} from "./models/board";
import {UserService} from "./services/user.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {User} from "./models/user";
import {Colors} from "./models/colors";
import {lightTheme} from "./data/light-theme";
import {darkTheme} from "./data/dark-theme";
import {BoardService} from "./services/board.service";
import {Column} from "./models/column";
import {Observable} from "rxjs";
import {ErrorService} from "./services/error.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit {

  title: string = "stack check"
  user: User
  board: Board | null
  colors: Colors[] = lightTheme
  columnDropLists: string[] = []
  taskDropLists: string[] = []
  subtaskDropLists: string[] = []

  constructor(private userService: UserService,
              private boardService: BoardService,
              public errorService: ErrorService,
              private _snackBar: MatSnackBar) {
    this.errorService.error$.subscribe({next: (message) => {
      if (message) {
        this.openSnackBar("Произошла ошибка, пожалуйста перезагрузите страницу.", "Закрыть")
      }
    }})
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(data => {
      this.user = data
      if (data.darkTheme) {
        this.colors = darkTheme
      }
      if (data.lastBoard != null) {
        this.openBoard(data.lastBoard)
      }
    })
  }

  newBoard() {
    let board: Observable<Board> = this.boardService.createBoard(this.user.id, this.user.boards.length)
    board.subscribe(data => {
      this.user.boards.push(data)
      this.board = data
      this.user.lastBoard = data.id
      this.userService.lastBoard(this.user.id, data.id)
    })
  }

  openBoard(id: string) {
    if (this.board?.id != id) {
      this.board = null
      this.boardService.getBoardById(id).subscribe(data => this.board = data)
      this.user.lastBoard = id
      this.userService.lastBoard(this.user.id, id)
    }
  }

  closeBoard() {
    this.board = null
    this.user.lastBoard = null
    this.userService.lastBoard(this.user.id, null)
    this.columnDropLists = []
  }

  renameBoard(boardId: string, boardName: string) {
    for (let i = 0; i < this.user.boards.length; i++) {
      if (this.user.boards[i].id == boardId) {
        this.user.boards[i].name = boardName
      }
    }
    this.boardService.renameBoard(boardId, boardName)
  }

  moveBoard(event: CdkDragDrop<Board[]>) {
    this.boardService.moveBoard(this.user.boards[event.previousIndex].id,
      this.user.id, event.previousIndex, this.user.id, event.currentIndex)
    moveItemInArray(this.user.boards, event.previousIndex, event.currentIndex);
  }

  deleteBoard(boardId: string, boardPosition: number) {
    if (this.board?.id == boardId) {
      this.board = null
      this.user.lastBoard = null
      this.userService.lastBoard(this.user.id, null)
    }
    this.boardService.deleteBoard(this.user.id, boardId, boardPosition)
    for (let i = 0; i < this.user.boards.length; i++) {
      if (this.user.boards[i].id == boardId) {
        this.user.boards.splice(i, 1)
      }
    }
  }

  newColumn() {
    this.board?.columns.push(new Column("", "", this.board?.columns.length))
  }

  changeTheme() {
    if (!this.user.darkTheme) {
      this.colors = darkTheme
    } else {
      this.colors = lightTheme
    }
    this.user.darkTheme = !this.user.darkTheme
    this.userService.darkTheme(this.user.id, this.user.darkTheme)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top'});
    this._snackBar._openedSnackBarRef?.afterDismissed().subscribe(() => this.actionSnackBar())
  }

  actionSnackBar() {
    console.log("ACTION!!!")
  }
}
