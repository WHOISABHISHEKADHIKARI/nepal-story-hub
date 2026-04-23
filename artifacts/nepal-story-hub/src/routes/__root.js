import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, createRootRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
function NotFoundComponent() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: _jsxs("div", { className: "editorial-panel max-w-xl rounded-[2rem] px-8 py-12 text-center", children: [_jsx("div", { className: "section-kicker justify-center", children: "Lost your place?" }), _jsx("h1", { className: "mt-4 font-display text-7xl text-foreground", children: "404" }), _jsx("h2", { className: "mt-4 text-2xl font-semibold text-foreground", children: "Page not found" }), _jsx("p", { className: "mt-3 font-serif text-muted-foreground", children: "The story you're looking for does not exist or has been moved." }), _jsx("div", { className: "mt-8", children: _jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Return home" }) })] }) }));
}
export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
});
function RootComponent() {
    const navigate = useNavigate();
    useEffect(() => {
        let cancelled = false;
        const exchangeOAuthCode = async () => {
            const currentUrl = new URL(window.location.href);
            const code = currentUrl.searchParams.get("code");
            if (!code)
                return;
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (cancelled || error)
                return;
            currentUrl.searchParams.delete("code");
            currentUrl.searchParams.delete("state");
            window.history.replaceState({}, document.title, currentUrl.pathname + currentUrl.search);
            // If callback lands on root, finish by routing to login page
            // so app-level redirect rules remain consistent.
            if (currentUrl.pathname === "/") {
                void navigate({ to: "/login" });
            }
        };
        void exchangeOAuthCode();
        return () => {
            cancelled = true;
        };
    }, [navigate]);
    return (_jsxs(AuthProvider, { children: [_jsx(Outlet, {}), _jsx(Toaster, {})] }));
}
