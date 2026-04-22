import { createFileRoute, Outlet, Link, redirect, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Users, FolderTree, Inbox, LogOut, PenLine, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: "/admin" } });
    const roleCandidates = [
      session.user.app_metadata?.roles,
      session.user.user_metadata?.roles,
      session.user.app_metadata?.role,
      session.user.user_metadata?.role,
    ].flatMap((value: unknown) => Array.isArray(value) ? value : value ? [value] : []);
    const isAdmin = roleCandidates.some((role) => {
      const normalized = String(role).toLowerCase();
      return normalized === "admin" || normalized === "editor";
    });
    if (!isAdmin) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

const navItems: { to: "/admin" | "/admin/posts" | "/admin/review" | "/admin/contributors" | "/admin/categories"; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/review", label: "Review queue", icon: Inbox },
  { to: "/admin/contributors", label: "Contributors", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
];

function AdminLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="border-b border-border/60 p-4 md:min-h-screen md:border-b-0 md:border-r md:p-5">
        <div className="app-panel h-full p-5 md:p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-primary">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl font-semibold">
                Hamro<span className="text-primary">Katha</span>
              </div>
              <div className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">Editorial desk</div>
            </div>
          </Link>

          <nav className="mt-8 grid gap-2 md:block md:space-y-2">
            {navItems.map((item) => {
              const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="admin-nav-link"
                  data-active={active}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-border/60 pt-4">
            <Link to="/dashboard/new" className="admin-nav-link">
              <PenLine className="h-4 w-4" />
              Write a story
            </Link>
            <button onClick={signOut} className="admin-nav-link mt-2 w-full text-left">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
            <div className="mt-4 rounded-2xl border border-border/60 bg-white/45 px-4 py-3 text-sm text-muted-foreground">
              <div className="text-[0.68rem] uppercase tracking-[0.18em]">Signed in</div>
              <div className="mt-1 truncate text-foreground">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
