
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi, type MCPPost } from "@/lib/api-mcp";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: "/dashboard" } });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    if (!roles?.length) throw redirect({ to: "/become-contributor" });
  },
  component: ContributorDashboard,
});

function ContributorDashboard() {
  const [posts, setPosts] = useState<MCPPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mcpApi.listPosts();
      const data = res.data || [];
      
      // In a real app, we'd filter by the current user's MCP author profile.
      // For now, since we don't have that mapping yet, we'll show all or a subset.
      // The user wants "acces to crud to everything that is accesible to contributer".
      setPosts(data);
    } catch (err) {
      console.error("Failed to load dashboard posts:", err);
      toast.error("Failed to load your stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (slug: string) => {
    if (!confirm("Delete this story permanently?")) return;
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
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl">Your stories</h1>
          <p className="text-muted-foreground mt-1">Manage and track your published content.</p>
        </div>
        <Link to="/dashboard/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New story
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl">
          <p className="text-muted-foreground italic font-serif">You haven't written any stories yet.</p>
          <Link to="/dashboard/new" className="mt-4 inline-block">
            <Button variant="outline">Write your first story</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground font-medium">
              <tr>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium line-clamp-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.category.name}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-tight ${
                      p.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      p.status === "draft" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {format(new Date(p.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {p.status === "published" && (
                        <Link to="/blog/$slug" params={{ slug: p.slug }} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )}
                      <Link to="/dashboard/edit/$id" params={{ id: p.slug }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => remove(p.slug)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
