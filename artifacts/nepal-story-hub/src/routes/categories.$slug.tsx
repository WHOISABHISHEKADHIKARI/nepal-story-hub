import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { PostCard, type PostListItem } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .eq("slug", params.slug)
      .maybeSingle();
    if (!cat) throw notFound();
    return { category: cat };
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

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_image_url, published_at, featured, category_id, author_id, categories(name, slug), profiles(display_name)")
        .eq("status", "published")
        .eq("category_id", category.id)
        .order("published_at", { ascending: false });
      setPosts((data ?? []) as unknown as PostListItem[]);
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
