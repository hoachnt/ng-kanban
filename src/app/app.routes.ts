import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ToolbarComponent } from "./ui/layout/toolbar/toolbar.component";

export const routes: Routes = [
    {
        path: "",
        component: ToolbarComponent,
        children: [{ path: "", component: HomePageComponent }],
    },
];
