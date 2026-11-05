import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core'
import {Board} from '../../models/board'
import {Column} from '../../models/column'
import {BoardStore} from '../../state/board.store'
import {dropIndex, isNoopDrop} from '../../utils/drag-drop'
import {ColumnComponent} from '../column/column.component'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropList, CdkDrag, ColumnComponent],
})
export class BoardComponent {
  protected readonly store = inject(BoardStore)

  readonly board = input.required<Board>()

  onColumnDrop(event: CdkDragDrop<readonly Column[]>) {
    if (isNoopDrop(event)) {
      return
    }
    const columns = this.store.board()?.columns ?? []
    const index = dropIndex(
      columns,
      this.board().columns.map(column => column.id),
      event.item.data.id,
      event.currentIndex,
    )
    this.store.moveColumn(event.item.data.id, index)
  }
}
