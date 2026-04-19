import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";

interface ReviewPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  created_at: string;
  reviewer_notes: string | null;
  profiles?: { display_name: string } | null;
  categories?: { name: string } | null;
}

export const Route = createFileRoute("/admin/review")({
  component: ReviewQueue,
});

function ReviewQueue() {
  const [posts, setPosts] = useState<ReviewPost[]>([]);
  const [selected, setSelected] = useState<ReviewPost | null>(null);
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await mcpApi.listPosts();
      const data = res.data || [];
      const pending = data
        .filter((p: any) => p.status === "draft")
        .map((p: any) => ({
          id: String(p.id),
          title: p.title,
          slug: p.slug,
          excerpt: p.description,
          content: p.content,
          cover_image_url: p.image_url,
          created_at: p.created_at,
          reviewer_notes: null,
          profiles: { display_name: p.author.name },
          categories: { name: p.category.name }
        }));
      setPosts(pending);
    } catch (err) {
      console.error("Failed to load review queue:", err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (slug: string) => {
    try {
      const res = await mcpApi.publishPost(slug);
      if (res.success) {
        toast.success("Published");
        setSelected(null);
        setNotes("");
        load();
      } else {
        toast.error("Failed to publish");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const reject = async (_slug: string) => {
    toast.error("Rejection with feedback is not supported in MCP yet. Post remains in draft.");
    setSelected(null);
    setNotes("");
  };

  return (
    <div className="p-8 grid lg:grid-cols-[300px_1fr] gap-8">
      <div>
        <h1 className="font-display text-2xl mb-4">Review queue</h1>
        <div className="space-y-2">
          {posts.length === 0 && <p className="text-sm text-muted-foreground italic">Inbox zero. ✨</p>}
          {posts.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setNotes(p.reviewer_notes ?? ""); }}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                selected?.id === p.id ? "border-primary bg-primary/5" : "border-border/60 bg-card hover:bg-muted/50"
              }`}
            >
              <div className="font-medium text-sm line-clamp-2">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {p.profiles?.display_name} · {format(new Date(p.created_at), "MMM d")}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        {selected ? (
          <div className="bg-card border border-border/60 rounded-lg p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">{selected.categories?.name}</div>
            <h2 className="font-display text-3xl mt-2">{selected.title}</h2>
            <div className="text-sm text-muted-foreground mt-1">By {selected.profiles?.display_name}</div>
            {selected.excerpt && <p className="mt-4 italic font-serif text-muted-foreground">{selected.excerpt}</p>}
            {selected.cover_image_url && <img src={selected.cover_image_url} alt="" className="mt-4 rounded-md w-full max-h-72 object-cover" />}
            <div className="prose-editorial mt-6 max-h-96 overflow-auto p-4 bg-paper rounded border border-border/60">
              <div dangerouslySetInnerHTML={{ __html: /<\/?[a-z]/i.test(selected.content) ? selected.content : selected.content.split(/\n{2,}/).map(p => `<p>${p.replace(/</g, "&lt;")}</p>`).join("") }} />
            </div>
            <div className="mt-6">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Feedback to writer (required to reject)</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5" placeholder="What needs work, or what made it great…" />
            </div>
            <div className="flex gap-2">
                <Button onClick={() => approve(selected.slug)}>Approve & publish</Button>
                <Button variant="outline" onClick={() => reject(selected.slug)}>Send feedback</Button>
              </div>
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-12 text-center text-muted-foreground italic font-serif">
            Select a post to review.
          </div>
        )}
      </div>
    </div>
  );
}
