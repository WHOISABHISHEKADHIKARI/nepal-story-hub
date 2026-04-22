import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";
import { FolderOpen, Clock3, BookOpenText } from "lucide-react";

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
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;

  const load = useCallback(async () => {
    try {
      const res = await mcpApi.listPosts();
      const data = res.data || [];

      let mapped: PostRow[] = data.map((p) => ({
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        status: p.status,
        featured: false,
        created_at: p.created_at,
        published_at: p.published_at,
        profiles: { display_name: p.author.name },
        categories: { name: p.category.name },
      }));

      if (filter !== "all") {
        mapped = mapped.filter((p) => p.status === filter);
      }

      setPosts(mapped);
    } catch (err) {
      console.error("Failed to load admin posts:", err);
      toast.error("Failed to load posts");
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleFeatured = async (_id: string, _featured: boolean) => {
    toast.error("Featured status is not supported by the current API yet.");
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      const res = await mcpApi.deletePost(slug);
      if (res.success) {
        toast.success("Deleted");
        void load();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="app-page">
      <section className="workspace-hero px-6 py-8 md:px-8 md:py-9">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="section-kicker">Editorial archive</span>
            <h1 className="mt-3 font-display text-3xl md:text-5xl">All posts, with the queue visible at a glance.</h1>
          </div>
          <div className="workspace-bar">
            <Link to="/dashboard/new">
              <Button className="rounded-full px-5">New post</Button>
            </Link>
          </div>
        </div>
        <div className="workspace-metrics mt-6">
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><FolderOpen className="h-4 w-4" /> Filtered view</div>
            <div className="workspace-metric-value mt-3">{posts.length}</div>
            <div className="workspace-metric-label">Posts in this view</div>
          </div>
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><Clock3 className="h-4 w-4" /> Drafts</div>
            <div className="workspace-metric-value mt-3">{draftCount}</div>
            <div className="workspace-metric-label">Still in progress</div>
          </div>
          <div className="workspace-note">
            <div className="flex items-center gap-2 text-primary"><BookOpenText className="h-4 w-4" /> Published cadence</div>
            <div className="mt-3 font-display text-2xl leading-tight text-foreground">{publishedCount} live stories</div>
            <div className="mt-2 text-sm leading-7">Use the filter chips to move between live output and editorial backlog without losing context.</div>
          </div>
        </div>
      </section>

      <div className="mt-5 mb-5 flex flex-wrap gap-2">
        {(["all", "draft", "pending", "published"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="pill-filter"
            data-active={filter === f}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="app-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[920px]">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-medium text-foreground">{p.title}</div>
                    {p.featured && <span className="mt-1 inline-block text-xs uppercase tracking-[0.14em] text-primary">Featured</span>}
                  </td>
                  <td className="text-muted-foreground">{p.profiles?.display_name ?? "-"}</td>
                  <td className="text-muted-foreground">{p.categories?.name ?? "-"}</td>
                  <td>
                    <span className="status-chip" data-status={["published", "draft", "pending"].includes(p.status) ? p.status : "default"}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{format(new Date(p.published_at ?? p.created_at), "MMM d, yyyy")}</td>
                  <td>
                    <div className="flex justify-end gap-3 text-sm">
                      {p.status === "published" && (
                        <button onClick={() => toggleFeatured(p.id, p.featured)} className="text-primary hover:underline">
                          {p.featured ? "Unfeature" : "Feature"}
                        </button>
                      )}
                      <Link to="/dashboard/edit/$id" params={{ id: p.slug }} className="text-primary hover:underline">Edit</Link>
                      <button onClick={() => remove(p.slug)} className="text-destructive hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center font-serif italic text-muted-foreground">
                    No posts in this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
