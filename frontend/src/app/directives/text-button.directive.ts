import {Directive, ElementRef, HostListener, input} from '@angular/core'
import {Colors} from '../models/colors'

@Directive({selector: '[appTextButton]'})
export class TextButtonDirective {
  readonly matIcon = input.required<ElementRef<HTMLElement>>()
  readonly text = input.required<HTMLElement>()
  readonly color = input.required<Colors>()

  @HostListener('mouseenter') onMouseEnter() {
    this.paint(this.color().secondColor)
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.paint(this.color().firstColor)
  }

  private paint(color: string) {
    this.matIcon().nativeElement.style.color = color
    this.text().style.color = color
  }
}
