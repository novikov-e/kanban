import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import {Board} from "../../models/board";
import {Colors} from "../../models/colors";
import {Column} from "../../models/column";
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from "@angular/cdk/drag-drop";
import {AppComponent} from "../../app.component";
import {ColumnService} from "../../services/column.service";
import { ColumnComponent } from '../column/column.component';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['../../app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CdkDropList, CdkDrag, ColumnComponent]
})
export class BoardComponent implements OnInit {
  private columnService = inject(ColumnService);


  @Input() board: Board
  @Input() colors: Colors[]
  @Input() columnDropLists: string[]
  @Input() taskDropLists: string[]
  @Input() subtaskDropLists: string[]
  @Input() appComponent: AppComponent

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
