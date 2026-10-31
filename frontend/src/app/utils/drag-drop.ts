import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'

export function applyDrop<T>(event: CdkDragDrop<T[]>): void {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
  } else {
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
  }
}

export function removeItem<T>(items: T[], item: T): void {
  items.splice(items.indexOf(item), 1)
}
