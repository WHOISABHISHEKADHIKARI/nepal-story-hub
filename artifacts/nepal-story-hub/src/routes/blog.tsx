import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { PostCard, type PostListItem } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
});

function BlogIndex() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const catsRes = await mcpApi.listCategories();
        const catsData = catsRes.data || [];
        setCategories(catsData.map(c => ({ id: String(c.id), name: c.name, slug: c.slug })));

        const postsRes = await mcpApi.listPosts();
        const postsData = postsRes.data || [];
        
        const mappedPosts: PostListItem[] = postsData.map(p => ({
          id: String(p.id),
          slug: p.slug,
          title: p.title,
          excerpt: p.description,
          cover_image_url: p.image_url,
          published_at: p.published_at,
          featured: false,
          category_id: String(p.category.id),
          author_id: String(p.author.id),
          categories: { name: p.category.name, slug: p.category.slug },
          profiles: { display_name: p.author.name }
        }));

        setPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCat]);

  const filtered = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(q.toLowerCase()),
      )
    : posts;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Stories</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">Every story we've published.</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCat(null)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full border transition-colors ${
                activeCat === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full border transition-colors ${
                  activeCat === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground italic font-serif">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground font-serif italic">No stories yet in this section.</p>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-2">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
