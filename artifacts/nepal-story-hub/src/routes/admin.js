import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Outlet, Link, redirect, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Users, FolderTree, Inbox, LogOut, PenLine, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
const SUPER_ADMIN_EMAILS = new Set(["abhishekadikari1254@gmail.com"]
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean));
export const Route = createFileRoute("/admin")({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session)
            throw redirect({ to: "/login", search: { redirect: "/admin" } });
        const roleCandidates = [
            session.user.app_metadata?.roles,
            session.user.user_metadata?.roles,
            session.user.app_metadata?.role,
            session.user.user_metadata?.role,
        ].flatMap((value) => Array.isArray(value) ? value : value ? [value] : []);
        const isAdmin = roleCandidates.some((role) => {
            const normalized = String(role).toLowerCase();
            return normalized === "admin" || normalized === "editor";
        });
        const isSuperAdmin = SUPER_ADMIN_EMAILS.has(String(session.user.email ?? "").trim().toLowerCase());
        if (!isAdmin && !isSuperAdmin) {
            throw redirect({ to: "/" });
        }
    },
    component: AdminLayout,
});
const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/posts", label: "Posts", icon: FileText },
    { to: "/admin/review", label: "Review queue", icon: Inbox },
    { to: "/admin/contributors", label: "Contributors", icon: Users },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
];
function AdminLayout() {
    const { signOut, user } = useAuth();
    const location = useLocation();
    return (_jsxs("div", { className: "admin-layout", children: [_jsx("aside", { className: "border-b border-border/60 p-4 md:min-h-screen md:border-b-0 md:border-r md:p-5", children: _jsxs("div", { className: "app-panel h-full p-5 md:p-6", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-primary", children: _jsx(Newspaper, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-display text-2xl font-semibold", children: ["Hamro", _jsx("span", { className: "text-primary", children: "Katha" })] }), _jsx("div", { className: "text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground", children: "Editorial desk" })] })] }), _jsx("nav", { className: "mt-8 grid gap-2 md:block md:space-y-2", children: navItems.map((item) => {
                                const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
                                return (_jsxs(Link, { to: item.to, className: "admin-nav-link", "data-active": active, children: [_jsx(item.icon, { className: "h-4 w-4" }), item.label] }, item.to));
                            }) }), _jsxs("div", { className: "mt-8 border-t border-border/60 pt-4", children: [_jsxs(Link, { to: "/dashboard/new", className: "admin-nav-link", children: [_jsx(PenLine, { className: "h-4 w-4" }), "Write a story"] }), _jsxs("button", { onClick: signOut, className: "admin-nav-link mt-2 w-full text-left", children: [_jsx(LogOut, { className: "h-4 w-4" }), "Sign out"] }), _jsxs("div", { className: "mt-4 rounded-2xl border border-border/60 bg-white/45 px-4 py-3 text-sm text-muted-foreground", children: [_jsx("div", { className: "text-[0.68rem] uppercase tracking-[0.18em]", children: "Signed in" }), _jsx("div", { className: "mt-1 truncate text-foreground", children: user?.email })] })] })] }) }), _jsx("main", { className: "min-w-0", children: _jsx(Outlet, {}) })] }));
}
