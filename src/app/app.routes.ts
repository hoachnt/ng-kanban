import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ToolbarComponent } from "./ui/layout/toolbar/toolbar.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { canActivateAuth, canActivateLogin } from "./auth/access.guard";

export const routes: Routes = [
    {
        path: "",
        component: ToolbarComponent,
        children: [
            {
                path: "",
                component: HomePageComponent,
                data: { animation: "HomePage" },
            },
        ],
        canActivate: [canActivateAuth],
    },
    {
        path: "login",
        component: LoginPageComponent,
        data: { animation: "LoginPage" },
        canActivate: [canActivateLogin],
    },
];
