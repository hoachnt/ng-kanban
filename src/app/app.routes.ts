import { Routes } from "@angular/router";
import { ToolbarComponent } from "./ui/layout/toolbar/toolbar.component";
import { AuthLayoutComponent } from "./ui/layout/auth-layout/auth-layout.component";
import { canActivateAuth, canActivateLogin } from "./auth/access.guard";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./ui/layout/toolbar/toolbar.component").then(
                (m) => m.ToolbarComponent
            ),
        data: { animation: "ToolbarLayout" },
        children: [
            {
                path: "",
                loadComponent: () =>
                    import("./pages/home-page/home-page.component").then(
                        (m) => m.HomePageComponent
                    ),
                data: { animation: "HomePage" },
            },
            {
                path: "project/:id",
                loadComponent: () =>
                    import("./pages/project-page/project-page.component").then(
                        (m) => m.ProjectPageComponent
                    ),
                data: { animation: "ProjectPage" },
            },
        ],
        canActivate: [canActivateAuth],
    },
    {
        path: "auth",
        component: AuthLayoutComponent,
        data: { animation: "AuthLayout" },
        children: [
            {
                path: "login",
                loadComponent: () =>
                    import("./pages/login-page/login-page.component").then(
                        (m) => m.LoginPageComponent
                    ),
                data: { animation: "LoginPage" },
            },
            {
                path: "register",
                loadComponent: () =>
                    import(
                        "./pages/register-page/register-page.component"
                    ).then((m) => m.RegisterPageComponent),
                data: { animation: "RegisterPage" },
            },
        ],
        canActivate: [canActivateLogin],
    },
];
