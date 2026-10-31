import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop'
import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core'
import {Board} from '../../models/board'
import {Colors} from '../../models/colors'
import {Column} from '../../models/column'
import {ColumnService} from '../../services/column.service'
import {removeItem} from '../../utils/drag-drop'
import {ColumnComponent} from '../column/column.component'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CdkDropList, CdkDrag, ColumnComponent],
})
export class BoardComponent implements OnInit {
  private columnService = inject(ColumnService)

  @Input() board: Board
  @Input() colors: Colors[]
  @Input() columnDropLists: string[]
  @Input() taskDropLists: string[]
  @Input() subtaskDropLists: string[]

  ngOnInit(): void {
    this.columnDropLists.push(this.board.id)
  }

  removeColumn(column: Column) {
    removeItem(this.board.columns, column)
  }

  onColumnDrop(event: CdkDragDrop<Column[]>) {
    this.columnService.move(event.item.data.id, this.board.id, event.currentIndex)
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex)
  }
}
