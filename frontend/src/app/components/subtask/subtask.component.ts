import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {FocusDirective} from '../../directives/focus.directive'
import {Subtask} from '../../models/subtask'
import {BoardStore} from '../../state/board.store'

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatInput, CdkTextareaAutosize, FocusDirective],
})
export class SubtaskComponent {
  private store = inject(BoardStore)

  readonly subtask = input.required<Subtask>()
  readonly taskId = input.required<string>()

  rename(name: string) {
    this.store.renameSubtask(this.subtask().id, name)
  }

  toggleState() {
    this.store.toggleSubtask(this.subtask().id)
  }

  delete() {
    this.store.deleteSubtask(this.subtask().id)
  }

  onKeydown(input: HTMLTextAreaElement, event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && input.value !== '') {
      this.store.addSubtask(this.taskId())
    } else if (event.key === 'Escape') {
      if (input.value === '') {
        this.delete()
      }
      input.blur()
    }
  }
}
