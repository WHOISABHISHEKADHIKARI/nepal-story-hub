import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi, type MCPPost } from "@/lib/api-mcp";
import { Plus, Edit, Trash2, ExternalLink, FileText, Sparkles, Clock3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: "/dashboard" } });
  },
  component: ContributorDashboard,
});

function ContributorDashboard() {
  const [posts, setPosts] = useState<MCPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const latestPost = posts[0];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mcpApi.listPosts();
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to load dashboard posts:", err);
      toast.error("Failed to load your stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (slug: string) => {
    if (!confirm("Delete this story permanently?")) return;
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
            <span className="section-kicker">Contributor workspace</span>
            <h1 className="mt-3 font-display text-3xl md:text-5xl">Your stories, drafts, and next publishable idea.</h1>
            <p className="mt-3 max-w-2xl font-serif text-lg leading-8 text-muted-foreground">
              This desk is for writing with momentum. Draft quickly, revise carefully, and jump back into the latest piece without hunting through tables.
            </p>
          </div>
          <div className="workspace-bar">
            <Link to="/dashboard/new">
              <Button className="gap-2 rounded-full px-5">
                <Plus className="h-4 w-4" /> New story
              </Button>
            </Link>
            <div className="action-link text-sm">
              <Sparkles className="h-4 w-4" />
              Keep the draft moving
            </div>
          </div>
        </div>
        <div className="workspace-metrics mt-6">
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><FileText className="h-4 w-4" /> Desk total</div>
            <div className="workspace-metric-value mt-3">{posts.length}</div>
            <div className="workspace-metric-label">Stories on your board</div>
          </div>
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><Clock3 className="h-4 w-4" /> In progress</div>
            <div className="workspace-metric-value mt-3">{draftCount}</div>
            <div className="workspace-metric-label">Drafts needing attention</div>
          </div>
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><ExternalLink className="h-4 w-4" /> Live now</div>
            <div className="workspace-metric-value mt-3">{publishedCount}</div>
            <div className="workspace-metric-label">Published stories</div>
          </div>
          <div className="workspace-note">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary">Latest title</div>
            <div className="mt-3 font-display text-2xl leading-tight text-foreground">
              {latestPost?.title ?? "Your next story starts here"}
            </div>
            <div className="mt-2 text-sm leading-7">
              {latestPost ? `Last updated ${format(new Date(latestPost.created_at), "MMM d, yyyy")}.` : "Create a draft and this workspace starts feeling alive immediately."}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-6 grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="app-panel h-28 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="app-panel mt-6 px-6 py-14 text-center">
          <p className="font-serif italic text-muted-foreground">You have not written any stories yet.</p>
          <Link to="/dashboard/new" className="mt-5 inline-block">
            <Button variant="outline" className="rounded-full">Write your first story</Button>
          </Link>
        </div>
      ) : (
        <div className="app-panel mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[760px]">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-medium line-clamp-1 text-foreground">{p.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{p.category.name}</div>
                    </td>
                    <td>
                      <span className="status-chip" data-status={["published", "draft", "pending"].includes(p.status) ? p.status : "default"}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {format(new Date(p.created_at), "MMM d, yyyy")}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        {p.status === "published" && (
                          <Link to="/blog/$slug" params={{ slug: p.slug }} target="_blank">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                        <Link to="/dashboard/edit/$id" params={{ id: p.slug }}>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => remove(p.slug)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
