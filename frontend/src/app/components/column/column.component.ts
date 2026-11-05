import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop'
import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {FocusDirective} from '../../directives/focus.directive'
import {Column} from '../../models/column'
import {Task} from '../../models/task'
import {BoardStore} from '../../state/board.store'
import {isNoopDrop, taskListId} from '../../utils/drag-drop'
import {TaskComponent} from '../task/task.component'

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrl: './column.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatInput, CdkTextareaAutosize, FocusDirective, MatIcon, CdkDropList, CdkDrag, CdkDragHandle, TaskComponent],
})
export class ColumnComponent {
  protected readonly store = inject(BoardStore)

  readonly column = input.required<Column>()

  protected readonly taskListId = taskListId

  rename(name: string) {
    this.store.renameColumn(this.column().id, name)
  }

  delete() {
    this.store.deleteColumn(this.column().id)
  }

  addTask() {
    this.store.addTask(this.column().id)
  }

  onTaskDrop(event: CdkDragDrop<readonly Task[]>) {
    if (!isNoopDrop(event)) {
      this.store.moveTask(event.item.data.id, this.column().id, event.currentIndex)
    }
  }

  onKeydown(input: HTMLTextAreaElement, event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (input.value === '') {
        this.delete()
      }
      input.blur()
    }
  }
}
