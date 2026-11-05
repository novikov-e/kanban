import {CdkDragDrop} from '@angular/cdk/drag-drop'

export const taskListId = (columnId: string): string => `tasks-of-${columnId}`
export const subtaskListId = (taskId: string): string => `subtasks-of-${taskId}`

export function isNoopDrop<T>(event: CdkDragDrop<T>): boolean {
  return event.previousContainer === event.container && event.previousIndex === event.currentIndex
}

export function sameItems<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index])
}

/**
 * Индекс в полном списке после удаления `movingId`.
 * `visibleIndex` — место среди видимых элементов, как его сообщает список перетаскивания.
 * Скрытые элементы остаются на своих местах, видимый порядок совпадает с броском.
 */
export function dropIndex(
  items: readonly {id: string}[],
  visibleIds: readonly string[],
  movingId: string,
  visibleIndex: number,
): number {
  const visible = new Set(visibleIds)
  const rest = items.filter(item => item.id !== movingId)
  const anchors = rest.filter(item => visible.has(item.id))
  if (visibleIndex >= anchors.length) {
    const last = anchors.at(-1)
    return last ? rest.findIndex(item => item.id === last.id) + 1 : rest.length
  }
  return rest.findIndex(item => item.id === anchors[visibleIndex].id)
}
