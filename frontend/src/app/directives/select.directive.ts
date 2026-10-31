import { AfterViewInit, Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({ selector: '[appSelect]' })
export class SelectDirective implements AfterViewInit {
  private el = inject(ElementRef);


  ngAfterViewInit(): void {
    if (this.el.nativeElement.value == "Новый проект")
    this.el.nativeElement.select()
  }
}
