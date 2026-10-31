import {Directive, ElementRef, HostListener, Input} from '@angular/core'
import {Colors} from '../models/colors'

@Directive({selector: '[appButtonHover]'})
export class ButtonHoverDirective {
  @Input() elementRef: ElementRef<HTMLElement>
  @Input() color: Colors

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.style.color = this.color.secondColor
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.color = this.color.firstColor
  }
}
