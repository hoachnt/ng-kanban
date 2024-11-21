// app.routes.server.ts
import { RenderMode, ServerRoute } from "@angular/ssr";
export const serverRoutes: ServerRoute[] = [
    {
        path: "",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "auth/**",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "project/:id",
        renderMode: RenderMode.Client,
    },
    {
        path: "**", // All other routes will be rendered on the server (SSR)
        renderMode: RenderMode.Server,
    },
];
