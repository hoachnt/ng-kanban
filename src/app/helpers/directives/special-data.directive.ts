import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: "[appSpecialData]",
    standalone: true,
})
export class SpecialDataDirective {
    @Input("specialData") myAttribute!: string;

    constructor(private el: ElementRef) {}

    ngOnInit() {
        this.el.nativeElement.innerText = this.myAttribute;
    }
}
