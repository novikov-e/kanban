import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop'
import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {ButtonHoverDirective} from '../../directives/button-hover.directive'
import {FocusDirective} from '../../directives/focus.directive'
import {Colors} from '../../models/colors'
import {Column} from '../../models/column'
import {isSaved, UNSAVED_ID} from '../../models/entity'
import {DEFAULT_TASK_COLOR, Task} from '../../models/task'
import {ColumnService} from '../../services/column.service'
import {TaskService} from '../../services/task.service'
import {applyDrop, removeItem} from '../../utils/drag-drop'
import {TaskComponent} from '../task/task.component'

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatInput,
    CdkTextareaAutosize,
    FocusDirective,
    ButtonHoverDirective,
    MatIcon,
    CdkDropList,
    CdkDrag,
    TaskComponent,
  ],
})
export class ColumnComponent implements OnInit {
  private columnService = inject(ColumnService)
  private taskService = inject(TaskService)

  @Input() column: Column
  @Input() boardId: string
  @Input() taskDropLists: string[]
  @Input() subtaskDropLists: string[]
  @Input() colors: Colors[]
  @Output() deleted = new EventEmitter<void>()

  ngOnInit(): void {
    this.taskDropLists.push(this.column.id)
  }

  rename(name: string) {
    this.column.name = name
    if (isSaved(this.column)) {
      this.columnService.rename(this.column.id, name)
    } else {
      this.columnService.create(this.boardId, name).subscribe(created => {
        this.column.id = created.id
        this.taskDropLists.push(created.id)
      })
    }
  }

  delete() {
    if (isSaved(this.column)) {
      this.columnService.delete(this.column.id)
    }
    this.deleted.emit()
  }

  addTask() {
    this.column.tasks.push(new Task(UNSAVED_ID, '', this.column.tasks.length, DEFAULT_TASK_COLOR))
  }

  removeTask(task: Task) {
    removeItem(this.column.tasks, task)
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    this.taskService.move(event.item.data.id, this.column.id, event.currentIndex)
    applyDrop(event)
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
