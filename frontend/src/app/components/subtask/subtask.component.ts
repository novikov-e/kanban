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
import {NameSaver} from '../../utils/name-saver'

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

  private nameSaver = new NameSaver(
    name => this.subtaskService.create(this.taskId, name),
    (id, name) => this.subtaskService.rename(id, name).subscribe(),
  )

  rename(name: string) {
    this.nameSaver.save(this.subtask, name)
  }

  toggleState() {
    this.subtask.state = !this.subtask.state
    if (isSaved(this.subtask)) {
      this.subtaskService.changeState(this.subtask.id, this.subtask.state).subscribe()
    }
  }

  delete() {
    if (isSaved(this.subtask)) {
      this.subtaskService.delete(this.subtask.id).subscribe()
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
