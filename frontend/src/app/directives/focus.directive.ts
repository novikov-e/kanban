import { AfterViewInit, Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';

@Directive({ selector: '[appFocus]' })
export class FocusDirective implements AfterViewInit {
    private el = inject(ElementRef);


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
