import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {Colors} from "../models/colors";

@Directive({
  selector: '[appButtonHover]'
})
export class ButtonHoverDirective {

  @Input('elementRef') elementRef: ElementRef
  @Input('color') color: Colors

  constructor() {
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.style.color = this.color.secondColor
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.color = this.color.firstColor
  }
}
