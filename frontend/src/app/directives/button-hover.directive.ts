import {Directive, ElementRef, HostListener, input} from '@angular/core'
import {Colors} from '../models/colors'

@Directive({selector: '[appButtonHover]'})
export class ButtonHoverDirective {
  readonly elementRef = input.required<ElementRef<HTMLElement>>()
  readonly color = input.required<Colors>()

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef().nativeElement.style.color = this.color().secondColor
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef().nativeElement.style.color = this.color().firstColor
  }
}
