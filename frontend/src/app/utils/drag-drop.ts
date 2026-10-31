import {CdkDrag, CdkDragDrop} from '@angular/cdk/drag-drop'

export const isColumnDrag = (drag: CdkDrag): boolean => 'tasks' in drag.data
export const isTaskDrag = (drag: CdkDrag): boolean => 'subtasks' in drag.data
export const isSubtaskDrag = (drag: CdkDrag): boolean => 'state' in drag.data

export function isNoopDrop<T>(event: CdkDragDrop<T>): boolean {
  return event.previousContainer === event.container && event.previousIndex === event.currentIndex
}
