import { Link } from "@tanstack/react-router";
import { Menu, X, PenLine } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isContributor, signOut } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Stories" },
    { to: "/categories", label: "Categories" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Hamro<span className="text-primary">Katha</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "!text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              {isContributor && (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link to="/dashboard/new">
                    <Button size="sm" className="gap-1.5">
                      <PenLine className="h-3.5 w-3.5" />
                      Write
                    </Button>
                  </Link>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/login" search={{ redirect: "/dashboard/new" }}>
                <Button size="sm" className="gap-1.5">
                  <PenLine className="h-3.5 w-3.5" />
                  Start writing
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium py-2 text-muted-foreground"
                activeProps={{ className: "!text-foreground" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">Admin</Button>
                    </Link>
                  )}
                  {isContributor && (
                    <>
                      <Link to="/dashboard" onClick={() => setOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full">Dashboard</Button>
                      </Link>
                      <Link to="/dashboard/new" onClick={() => setOpen(false)}>
                        <Button size="sm" className="w-full">Write a story</Button>
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { signOut(); setOpen(false); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Sign in</Button>
                  </Link>
                  <Link to="/login" search={{ redirect: "/dashboard/new" }} onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full">Start writing</Button>
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
