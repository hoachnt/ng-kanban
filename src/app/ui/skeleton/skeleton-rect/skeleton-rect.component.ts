import { Component, ElementRef, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-skeleton-rect",
    host: {
        class: "pulse",
    },
    standalone: true,
    imports: [],
    template: "",
    styles: [
        `
            :host {
                display: block;
                width: var(--skeleton-rect-width);
                height: var(--skeleton-rect-height);
                background: var(--sys-surface) no-repeat;
            }
        `,
    ],
})
export class SkeletonRectComponent implements OnInit {
    @Input() width!: string;
    @Input() height!: string;
    @Input() className: string = "";

    constructor(private host: ElementRef<HTMLElement>) {}

    ngOnInit() {
        const host = this.host.nativeElement;

        // Handle multiple classes
        if (this.className) {
            const classList = this.className
                .split(" ")
                .filter((cls) => cls.trim() !== "");
            classList.forEach((cls) => host.classList.add(cls));
        }

        host.style.setProperty("--skeleton-rect-width", this.width ?? "100%");
        host.style.setProperty("--skeleton-rect-height", this.height ?? "20px");
    }
}
