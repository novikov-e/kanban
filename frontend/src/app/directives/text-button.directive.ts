import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {Colors} from "../models/colors";

@Directive({
  selector: '[appTextButton]'
})
export class TextButtonDirective {

  @Input('matIcon') matIcon: ElementRef
  @Input('text') text: any
  @Input('color') color: Colors

  constructor() { }

  @HostListener('mouseenter') onMouseEnter() {
    this.matIcon.nativeElement.style.color = this.color.secondColor
    this.text.style.color = this.color.secondColor
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.matIcon.nativeElement.style.color = this.color.firstColor
    this.text.style.color = this.color.firstColor
  }
}
