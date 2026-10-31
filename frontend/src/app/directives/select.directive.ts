import {AfterViewInit, Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[appSelect]',
    standalone: false
})
export class SelectDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    if (this.el.nativeElement.value == "Новый проект")
    this.el.nativeElement.select()
  }
}
