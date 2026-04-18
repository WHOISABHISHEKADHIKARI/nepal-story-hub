import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-semibold">
            Hamro<span className="text-primary">Katha</span>
          </span>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Stories from Nepal — the mountains, the markets, the monasteries, and the
            people who shape them. Written by voices on the ground.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground mb-3">Read</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/blog" className="hover:text-foreground">All stories</Link></li>
            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground mb-3">Contribute</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/become-contributor" className="hover:text-foreground">Become a writer</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Writer login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Hamro Katha. Made with care in Kathmandu.</span>
          <span>Editorial independence. Community-driven.</span>
        </div>
      </div>
    </footer>
  );
}
