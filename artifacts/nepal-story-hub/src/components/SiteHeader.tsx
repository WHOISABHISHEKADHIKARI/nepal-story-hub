import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, PenLine, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isContributor, signOut } = useAuth();
  const location = useLocation();
  const showBack = location.pathname !== "/";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Stories" },
    { to: "/categories", label: "Categories" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  const handleBack = () => {
    setOpen(false);
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/88 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white/50 text-foreground md:hidden"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary">
              HK
            </div>
            <div className="min-w-0">
              <span className="block font-display text-[2rem] font-semibold tracking-tight text-foreground">
                Hamro<span className="text-primary">Katha</span>
              </span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground sm:block">
                Stories from Nepal for curious readers
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="topbar-link"
              activeProps={{ "data-active": "true" as any, className: "topbar-link" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="rounded-full px-4">Admin</Button>
                </Link>
              )}
              {isContributor && (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="rounded-full px-4">Dashboard</Button>
                  </Link>
                  <Link to="/dashboard/new">
                    <Button size="sm" className="gap-1.5 rounded-full px-4 shadow-sm">
                      <PenLine className="h-3.5 w-3.5" />
                      Write
                    </Button>
                  </Link>
                </>
              )}
              <Button variant="ghost" size="sm" className="rounded-full px-4" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-full px-4">Sign in</Button>
              </Link>
              <Link to="/login" search={{ redirect: "/dashboard/new" }}>
                <Button size="sm" className="gap-1.5 rounded-full px-4 shadow-sm">
                  <PenLine className="h-3.5 w-3.5" />
                  Write
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-full border border-border/70 bg-white/50 p-2 text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/96 md:hidden">
          <div className="page-shell flex flex-col gap-3 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border/70 hover:bg-white/40 hover:text-foreground"
                activeProps={{ className: "!border-border/70 !bg-white/55 !text-foreground" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-1 flex flex-col gap-2 border-t border-border/60 pt-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full rounded-full">Admin</Button>
                    </Link>
                  )}
                  {isContributor && (
                    <>
                      <Link to="/dashboard" onClick={() => setOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full rounded-full">Dashboard</Button>
                      </Link>
                      <Link to="/dashboard/new" onClick={() => setOpen(false)}>
                        <Button size="sm" className="w-full rounded-full">Write a story</Button>
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="rounded-full" onClick={() => { signOut(); setOpen(false); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full rounded-full">Sign in</Button>
                  </Link>
                  <Link to="/login" search={{ redirect: "/dashboard/new" }} onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full rounded-full">Start writing</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
