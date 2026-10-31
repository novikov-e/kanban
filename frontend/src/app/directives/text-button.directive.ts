import {Directive, ElementRef, HostListener, Input} from '@angular/core'
import {Colors} from '../models/colors'

@Directive({selector: '[appTextButton]'})
export class TextButtonDirective {
  @Input() matIcon: ElementRef<HTMLElement>
  @Input() text: HTMLElement
  @Input() color: Colors

  @HostListener('mouseenter') onMouseEnter() {
    this.paint(this.color.secondColor)
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.paint(this.color.firstColor)
  }

  private paint(color: string) {
    this.matIcon.nativeElement.style.color = color
    this.text.style.color = color
  }
}
