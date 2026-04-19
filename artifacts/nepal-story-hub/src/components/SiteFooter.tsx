import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-paper/85">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-semibold">
            Hamro<span className="text-primary">Katha</span>
          </span>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            Stories from Nepal - the mountains, the markets, the monasteries, and the
            people who shape them. Written by voices on the ground.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Read</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/blog" className="hover:text-foreground">All stories</Link></li>
            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Contribute</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/become-contributor" className="hover:text-foreground">Become a writer</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Writer login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="page-shell flex flex-col justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Hamro Katha. Made with care in Kathmandu.</span>
          <span>Editorial independence. Community-driven.</span>
        </div>
      </div>
    </footer>
  );
}
