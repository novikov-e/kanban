import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu'
import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {ButtonHoverDirective} from '../../directives/button-hover.directive'
import {FocusDirective} from '../../directives/focus.directive'
import {Colors} from '../../models/colors'
import {Subtask} from '../../models/subtask'
import {Task} from '../../models/task'
import {BoardStore} from '../../state/board.store'
import {isNoopDrop, subtaskListId} from '../../utils/drag-drop'
import {SubtaskComponent} from '../subtask/subtask.component'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatInput,
    CdkTextareaAutosize,
    FocusDirective,
    ButtonHoverDirective,
    MatIcon,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    CdkDropList,
    CdkDrag,
    SubtaskComponent,
  ],
})
export class TaskComponent {
  protected readonly store = inject(BoardStore)

  readonly task = input.required<Task>()
  readonly colors = input.required<Colors[]>()

  protected readonly subtaskListId = subtaskListId

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

  onSubtaskDrop(event: CdkDragDrop<Subtask[]>) {
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
