import { createFileRoute, Outlet, Link, redirect, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Users, FolderTree, Inbox, LogOut, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: "/admin" } });

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    if (!roles?.some((r: { role: string }) => r.role === "admin" || r.role === "editor")) {
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
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 shrink-0 border-r border-border/60 bg-sidebar p-5 flex flex-col">
        <Link to="/" className="font-display text-xl font-semibold">
          Hamro<span className="text-primary">Katha</span>
        </Link>
        <div className="text-xs text-muted-foreground mt-0.5 mb-8">Admin</div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 pt-4 mt-4 space-y-1">
          <Link to="/dashboard/new" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
            <PenLine className="h-4 w-4" /> Write a story
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <div className="text-xs text-muted-foreground px-3 pt-2 truncate">{user?.email}</div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
