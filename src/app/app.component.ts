import {
    Component,
    Inject,
    inject,
    PLATFORM_ID,
    signal,
    ViewEncapsulation,
} from "@angular/core";
import { ChildrenOutletContexts, RouterOutlet } from "@angular/router";
import { slideInAnimation } from "./app.animations";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    animations: [slideInAnimation],
    encapsulation: ViewEncapsulation.None, // Add this line
})
export class AppComponent {
    isLoading$ = signal(true);

    title = "kanban";

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private contexts: ChildrenOutletContexts
    ) {}

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.isLoading$.set(false); // Hide loader after initial load
    }

    onActivate() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.isLoading$.set(false); // Hide loader when the component is activated
    }
    getRouteAnimationData() {
        return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
            "animation"
        ];
    }
}
