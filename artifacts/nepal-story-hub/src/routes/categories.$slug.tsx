import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { PostCard, type PostListItem } from "@/components/PostCard";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }: { params: { slug: string } }) => {
    try {
      const res = await mcpApi.listCategories();
      const cat = res.data?.find(c => c.slug === params.slug);
      if (!cat) throw notFound();
      return { category: { ...cat, id: String(cat.id), description: null } };
    } catch (err) {
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Category not found</h1>
      </div>
    </PublicLayout>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await mcpApi.listPosts();
        const data = res.data || [];
        
        const filtered = data
          .filter(p => String(p.category.id) === category.id)
          .map(p => ({
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
        
        setPosts(filtered);
      } catch (err) {
        console.error("Failed to load category posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [category.id]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <Link to="/categories" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> All categories
        </Link>
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Section</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{category.name}</h1>
        {category.description && <p className="mt-3 text-muted-foreground font-serif text-lg max-w-2xl">{category.description}</p>}

        <div className="mt-12">
          {posts.length === 0 ? (
            <p className="text-muted-foreground italic font-serif">No stories in this section yet.</p>
          ) : (
            <div className="grid gap-12 md:grid-cols-2">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
