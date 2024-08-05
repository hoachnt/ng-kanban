import { Inject, Optional } from "@angular/core";
import type { Context } from "@netlify/edge-functions";

export class FooComponent {
    constructor(
        // ...
        @Inject("netlify.request") @Optional() request?: Request,
        @Inject("netlify.context") @Optional() context?: Context
    ) {
        console.log(
            `Rendering Foo for path ${request?.url} from location ${context?.geo?.city}`
        );
        // ...
    }
}
