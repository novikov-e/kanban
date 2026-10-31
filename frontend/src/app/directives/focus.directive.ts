import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core'

@Directive({selector: '[appFocus]'})
export class FocusDirective implements AfterViewInit {
  private element = inject<ElementRef<HTMLTextAreaElement>>(ElementRef)

  ngAfterViewInit(): void {
    if (this.element.nativeElement.value === '') {
      this.element.nativeElement.focus()
    }
  }
}
