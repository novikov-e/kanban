import {AfterViewInit, Directive, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
    selector: '[appFocus]',
    standalone: false
})
export class FocusDirective implements AfterViewInit {

    constructor(private el: ElementRef) {
    }

    // @HostListener('document:click')
    // clickout() {
    //     console.log("Click outside")
    // }

    ngAfterViewInit(): void {
        if (this.el.nativeElement.value == "") {
            this.el.nativeElement.focus()
        }
    }
}
