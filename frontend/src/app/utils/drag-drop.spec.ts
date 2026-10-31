import {CdkDrag} from '@angular/cdk/drag-drop'
import {Column} from '../models/column'
import {Subtask} from '../models/subtask'
import {Task} from '../models/task'
import {isColumnDrag, isSubtaskDrag, isTaskDrag} from './drag-drop'

const drag = (data: unknown) => ({data}) as CdkDrag

describe('drop list predicates', () => {
  const column = drag(new Column('column', 'Колонка', 0))
  const task = drag(new Task('task', 'Задача', 0, 1))
  const subtask = drag(new Subtask('subtask', 'Подзадача', false, 0))

  it('accept only items of their own level', () => {
    expect([column, task, subtask].map(isColumnDrag)).toEqual([true, false, false])
    expect([column, task, subtask].map(isTaskDrag)).toEqual([false, true, false])
    expect([column, task, subtask].map(isSubtaskDrag)).toEqual([false, false, true])
  })
})
