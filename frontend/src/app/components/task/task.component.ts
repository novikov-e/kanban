import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu'
import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {ButtonHoverDirective} from '../../directives/button-hover.directive'
import {FocusDirective} from '../../directives/focus.directive'
import {Colors} from '../../models/colors'
import {isSaved, UNSAVED_ID} from '../../models/entity'
import {Subtask} from '../../models/subtask'
import {Task} from '../../models/task'
import {SubtaskService} from '../../services/subtask.service'
import {TaskService} from '../../services/task.service'
import {applyDrop, isSubtaskDrag, removeItem} from '../../utils/drag-drop'
import {NameSaver} from '../../utils/name-saver'
import {SubtaskComponent} from '../subtask/subtask.component'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private taskService = inject(TaskService)
  private subtaskService = inject(SubtaskService)

  protected readonly isSubtaskDrag = isSubtaskDrag

  @Input() task: Task
  @Input() columnId: string
  @Input() colors: Colors[]
  @Output() deleted = new EventEmitter<void>()

  private nameSaver = new NameSaver(
    name => this.taskService.create(this.columnId, name),
    (id, name) => this.taskService.rename(id, name).subscribe(),
  )

  rename(name: string) {
    this.nameSaver.save(this.task, name)
  }

  changeColor(color: number) {
    this.task.color = color
    if (isSaved(this.task)) {
      this.taskService.changeColor(this.task.id, color).subscribe()
    }
  }

  addSubtask() {
    this.task.subtasks.push(new Subtask(UNSAVED_ID, '', false, this.task.subtasks.length))
  }

  removeSubtask(subtask: Subtask) {
    removeItem(this.task.subtasks, subtask)
  }

  onSubtaskDrop(event: CdkDragDrop<Subtask[]>) {
    const subtask: Subtask = event.item.data
    if (isSaved(subtask) && isSaved(this.task)) {
      this.subtaskService.move(subtask.id, this.task.id, event.currentIndex).subscribe()
    }
    applyDrop(event)
  }

  delete() {
    if (isSaved(this.task)) {
      this.taskService.delete(this.task.id).subscribe()
    }
    this.deleted.emit()
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
