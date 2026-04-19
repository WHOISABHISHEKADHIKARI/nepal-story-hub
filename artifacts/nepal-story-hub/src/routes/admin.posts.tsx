import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  created_at: string;
  published_at: string | null;
  profiles?: { display_name: string } | null;
  categories?: { name: string } | null;
}

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

function AdminPosts() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [filter, setFilter] = useState<"all" | "draft" | "pending" | "published">("all");

  const load = useCallback(async () => {
    try {
      const res = await mcpApi.listPosts();
      const data = res.data || [];
      
      let mapped: PostRow[] = data.map(p => ({
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        status: p.status,
        featured: false,
        created_at: p.created_at,
        published_at: p.published_at,
        profiles: { display_name: p.author.name },
        categories: { name: p.category.name }
      }));

      if (filter !== "all") {
        mapped = mapped.filter(p => p.status === filter);
      }
      
      setPosts(mapped);
    } catch (err) {
      console.error("Failed to load admin posts:", err);
      toast.error("Failed to load posts");
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const toggleFeatured = async (id: string, featured: boolean) => {
    toast.error("Featured status is not supported by the new API yet.");
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      const res = await mcpApi.deletePost(slug);
      if (res.success) {
        toast.success("Deleted");
        load();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">All posts</h1>
        <Link to="/dashboard/new">
          <Button>New post</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        {(["all", "draft", "pending", "published"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full border ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Author</th>
              <th className="text-left p-3 font-medium">Category</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="p-3">
                  <div className="font-medium">{p.title}</div>
                  {p.featured && <span className="text-xs text-primary">★ Featured</span>}
                </td>
                <td className="p-3 text-muted-foreground">{p.profiles?.display_name ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{p.categories?.name ?? "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    p.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                    p.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                    "bg-muted text-muted-foreground"
                  }`}>{p.status}</span>
                </td>
                <td className="p-3 text-muted-foreground text-xs">{format(new Date(p.published_at ?? p.created_at), "MMM d, yyyy")}</td>
                <td className="p-3 text-right space-x-2">
                  {p.status === "published" && (
                    <button onClick={() => toggleFeatured(p.id, p.featured)} className="text-xs text-primary hover:underline">
                      {p.featured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <Link to="/dashboard/edit/$id" params={{ id: p.slug }} className="text-xs text-primary hover:underline">Edit</Link>
                  <button onClick={() => remove(p.slug)} className="text-xs text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground italic">No posts.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
