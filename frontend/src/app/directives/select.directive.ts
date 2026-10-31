import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core'
import {NEW_BOARD_NAME} from '../models/board'

@Directive({selector: '[appSelect]'})
export class SelectDirective implements AfterViewInit {
  private element = inject<ElementRef<HTMLInputElement>>(ElementRef)

  ngAfterViewInit(): void {
    if (this.element.nativeElement.value === NEW_BOARD_NAME) {
      this.element.nativeElement.select()
    }
  }
}
