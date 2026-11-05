import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop'
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu'
import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {FocusDirective} from '../../directives/focus.directive'
import {Subtask} from '../../models/subtask'
import {Task, TASK_COLORS} from '../../models/task'
import {BoardStore} from '../../state/board.store'
import {isNoopDrop, subtaskListId} from '../../utils/drag-drop'
import {SubtaskComponent} from '../subtask/subtask.component'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[attr.data-color]': 'task().color'},
  imports: [
    MatInput,
    CdkTextareaAutosize,
    FocusDirective,
    MatIcon,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    SubtaskComponent,
  ],
})
export class TaskComponent {
  protected readonly store = inject(BoardStore)

  readonly task = input.required<Task>()

  protected readonly subtaskListId = subtaskListId
  protected readonly taskColors = TASK_COLORS

  rename(name: string) {
    this.store.renameTask(this.task().id, name)
  }

  changeColor(color: number) {
    this.store.changeTaskColor(this.task().id, color)
  }

  addSubtask() {
    this.store.addSubtask(this.task().id)
  }

  delete() {
    this.store.deleteTask(this.task().id)
  }

  onSubtaskDrop(event: CdkDragDrop<readonly Subtask[]>) {
    if (!isNoopDrop(event)) {
      this.store.moveSubtask(event.item.data.id, this.task().id, event.currentIndex)
    }
  }

  onKeydown(input: HTMLTextAreaElement, event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && input.value !== '') {
      this.addSubtask()
    } else if (event.key === 'Escape') {
      if (input.value === '') {
        this.delete()
      }
      input.blur()
    }
  }
}
