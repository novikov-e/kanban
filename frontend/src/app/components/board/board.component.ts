import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray} from '@angular/cdk/drag-drop'
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core'
import {Board} from '../../models/board'
import {Colors} from '../../models/colors'
import {Column} from '../../models/column'
import {isSaved} from '../../models/entity'
import {ColumnService} from '../../services/column.service'
import {isColumnDrag, removeItem} from '../../utils/drag-drop'
import {ColumnComponent} from '../column/column.component'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, ColumnComponent],
})
export class BoardComponent {
  private columnService = inject(ColumnService)

  protected readonly isColumnDrag = isColumnDrag

  @Input() board: Board
  @Input() colors: Colors[]

  removeColumn(column: Column) {
    removeItem(this.board.columns, column)
  }

  onColumnDrop(event: CdkDragDrop<Column[]>) {
    const column: Column = event.item.data
    if (isSaved(column)) {
      this.columnService.move(column.id, this.board.id, event.currentIndex)
    }
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex)
  }
}
