import {Component, Input, OnInit} from '@angular/core';
import {Board} from "../../models/board";
import {Colors} from "../../models/colors";
import {Column} from "../../models/column";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AppComponent} from "../../app.component";
import {ColumnService} from "../../services/column.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['../../app.component.css']
})
export class BoardComponent implements OnInit {

  @Input() board: Board
  @Input() colors: Colors[]
  @Input() columnDropLists: string[]
  @Input() taskDropLists: string[]
  @Input() subtaskDropLists: string[]
  @Input() appComponent: AppComponent

  constructor(private columnService: ColumnService) {}

  ngOnInit(): void {
    this.columnDropLists.push(this.board.id)
  }

  moveColumn(event: CdkDragDrop<Column[]>) {
    this.columnService.moveColumn(this.board.columns[event.previousIndex].id, this.board.id,
        event.previousIndex, this.board.id, event.currentIndex)
    this.board.columns[event.previousIndex].position = event.currentIndex
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
}
