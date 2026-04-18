import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories")({
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const [cats, setCats] = useState<{ id: string; name: string; slug: string; description: string | null; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("categories").select("id, name, slug, description").order("name");
      const withCounts = await Promise.all(
        (data ?? []).map(async (c) => {
          const { count } = await supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("category_id", c.id)
            .eq("status", "published");
          return { ...c, count: count ?? 0 };
        }),
      );
      setCats(withCounts);
    })();
  }, []);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Sections</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Categories</h1>
        <p className="mt-4 text-muted-foreground font-serif text-lg max-w-2xl">
          Stories sorted by what they're really about.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cats.map((c) => (
            <Link
              key={c.id}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="group block p-6 bg-card border border-border/60 rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl group-hover:text-primary transition-colors">{c.name}</h2>
                <span className="text-xs text-muted-foreground">{c.count} {c.count === 1 ? "story" : "stories"}</span>
              </div>
              {c.description && <p className="mt-2 text-sm text-muted-foreground font-serif">{c.description}</p>}
            </Link>
          ))}
          {cats.length === 0 && (
            <div className="md:col-span-2 border border-dashed border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground font-serif italic">No categories yet. An admin can add them from the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
