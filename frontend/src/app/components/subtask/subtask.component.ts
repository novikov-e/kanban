import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {ButtonHoverDirective} from '../../directives/button-hover.directive'
import {FocusDirective} from '../../directives/focus.directive'
import {Colors} from '../../models/colors'
import {isSaved} from '../../models/entity'
import {Subtask} from '../../models/subtask'
import {SubtaskService} from '../../services/subtask.service'

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrls: ['../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatInput, CdkTextareaAutosize, FocusDirective, ButtonHoverDirective],
})
export class SubtaskComponent {
  private subtaskService = inject(SubtaskService)

  @Input() subtask: Subtask
  @Input() taskId: string
  @Input() color: Colors
  @Output() deleted = new EventEmitter<void>()
  @Output() nextRequested = new EventEmitter<void>()

  rename(name: string) {
    this.subtask.name = name
    if (isSaved(this.subtask)) {
      this.subtaskService.rename(this.subtask.id, name)
    } else {
      this.subtaskService.create(this.taskId, name).subscribe(created => (this.subtask.id = created.id))
    }
  }

  toggleState() {
    this.subtask.state = !this.subtask.state
    if (isSaved(this.subtask)) {
      this.subtaskService.changeState(this.subtask.id, this.subtask.state)
    }
  }

  delete() {
    if (isSaved(this.subtask)) {
      this.subtaskService.delete(this.subtask.id)
    }
    this.deleted.emit()
  }

  onKeydown(input: HTMLTextAreaElement, event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && input.value !== '') {
      this.nextRequested.emit()
    } else if (event.key === 'Escape') {
      if (input.value === '') {
        this.delete()
      }
      input.blur()
    }
  }
}
