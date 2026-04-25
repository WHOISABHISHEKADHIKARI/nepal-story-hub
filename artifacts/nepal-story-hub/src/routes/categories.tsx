import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/categories")({
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const [cats, setCats] = useState<{ id: string; name: string; slug: string; description: string | null; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await mcpApi.listCategories();
        const data = res.data || [];
        setCats(data.map(c => ({
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          description: null, // MCP doesn't have description in the simple list
          count: 0 // We don't have counts easily available in MCP list
        })));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    })();
  }, []);

  return (
    <PublicLayout>
      <div className="page-shell section-space">
        <span className="section-kicker">Sections</span>
        <h1 className="mt-3 font-display text-4xl md:text-6xl">Browse the publication by subject.</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground">
          Think of these as desks inside the publication: places, themes, beats, and recurring conversations.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cats.map((c) => (
            <Link
              key={c.id}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="category-tile group"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-3xl group-hover:text-primary transition-colors">{c.name}</h2>
                <span className="text-xs text-muted-foreground">{c.count} {c.count === 1 ? "story" : "stories"}</span>
              </div>
              <p className="mt-3 font-serif text-base leading-7 text-muted-foreground">
                {c.description ?? "A running shelf of stories from this desk."}
              </p>
            </Link>
          ))}
          {cats.length === 0 && (
            <div className="essay-panel md:col-span-2 text-center">
              <p className="text-muted-foreground font-serif italic">No categories yet. An admin can add them from the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
