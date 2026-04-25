import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-border/60 bg-paper/85">
      <div className="page-shell footer-grid py-14">
        <div className="max-w-xl">
          <span className="font-display text-[2rem] font-semibold">
            Hamro<span className="text-primary">Katha</span>
          </span>
          <p className="mt-4 max-w-lg font-serif text-base leading-8 text-muted-foreground">
            A publication shaped by Nepal&apos;s roads, rivers, neighborhoods, kitchens, harvests, and arguments. We publish stories with patience instead of noise.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Read</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blog" className="hover:text-foreground">All stories</Link></li>
              <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground">Contribute</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/become-contributor" className="hover:text-foreground">Become a writer</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/login" className="hover:text-foreground">Writer login</Link></li>
            </ul>
          </div>
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
