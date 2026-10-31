import {CdkDragDrop} from '@angular/cdk/drag-drop'

export const taskListId = (columnId: string): string => `tasks-of-${columnId}`
export const subtaskListId = (taskId: string): string => `subtasks-of-${taskId}`

export function isNoopDrop<T>(event: CdkDragDrop<T>): boolean {
  return event.previousContainer === event.container && event.previousIndex === event.currentIndex
}

export function sameItems<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index])
}
