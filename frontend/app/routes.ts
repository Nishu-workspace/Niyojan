import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/auth/auth-layout.tsx", [
        index("routes/root/home.tsx"),
        route("sign-in", "routes/auth/sign-in.tsx"),
        route("sign-up", "routes/auth/sign-up.tsx"),
        route("forgot-password", "routes/auth/forgot-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
        route("verify-email", "routes/auth/verify-email.tsx"),
    ])
] satisfies RouteConfig;
  