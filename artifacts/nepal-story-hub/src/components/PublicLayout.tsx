import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="publication-frame min-h-screen flex flex-col text-foreground">
      <SiteHeader />
      <main className="publication-main relative z-10 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
