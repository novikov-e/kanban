import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu'
import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core'
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
import {applyDrop, removeItem} from '../../utils/drag-drop'
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
export class TaskComponent implements OnInit {
  private taskService = inject(TaskService)
  private subtaskService = inject(SubtaskService)

  @Input() task: Task
  @Input() columnId: string
  @Input() subtaskDropLists: string[]
  @Input() colors: Colors[]
  @Output() deleted = new EventEmitter<void>()

  ngOnInit(): void {
    this.subtaskDropLists.push(this.task.id)
  }

  rename(name: string) {
    this.task.name = name
    if (isSaved(this.task)) {
      this.taskService.rename(this.task.id, name)
    } else {
      this.taskService.create(this.columnId, name).subscribe(created => {
        this.task.id = created.id
        this.subtaskDropLists.push(created.id)
      })
    }
  }

  changeColor(color: number) {
    this.task.color = color
    if (isSaved(this.task)) {
      this.taskService.changeColor(this.task.id, color)
    }
  }

  addSubtask() {
    this.task.subtasks.push(new Subtask(UNSAVED_ID, '', false, this.task.subtasks.length))
  }

  removeSubtask(subtask: Subtask) {
    removeItem(this.task.subtasks, subtask)
  }

  onSubtaskDrop(event: CdkDragDrop<Subtask[]>) {
    this.subtaskService.move(event.item.data.id, this.task.id, event.currentIndex)
    applyDrop(event)
  }

  delete() {
    if (isSaved(this.task)) {
      this.taskService.delete(this.task.id)
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
