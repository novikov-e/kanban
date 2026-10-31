import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core'
import {Board} from '../../models/board'
import {Colors} from '../../models/colors'
import {Column} from '../../models/column'
import {BoardStore} from '../../state/board.store'
import {isNoopDrop} from '../../utils/drag-drop'
import {ColumnComponent} from '../column/column.component'

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropList, CdkDrag, ColumnComponent],
})
export class BoardComponent {
  private store = inject(BoardStore)

  readonly board = input.required<Board>()
  readonly colors = input.required<Colors[]>()

  onColumnDrop(event: CdkDragDrop<Column[]>) {
    if (!isNoopDrop(event)) {
      this.store.moveColumn(event.item.data.id, event.currentIndex)
    }
  }
}
