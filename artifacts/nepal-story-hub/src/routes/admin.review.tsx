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
          categories: { name: p.category.name },
        }));
      setPosts(pending);
      setSelected((current) => current ? pending.find((item) => item.id === current.id) ?? pending[0] ?? null : pending[0] ?? null);
    } catch (err) {
      console.error("Failed to load review queue:", err);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const approve = async (slug: string) => {
    try {
      const res = await mcpApi.publishPost(slug);
      if (res.success) {
        toast.success("Published");
        setSelected(null);
        setNotes("");
        void load();
      } else {
        toast.error("Failed to publish");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const reject = async (_slug: string) => {
    toast.error("Rejection with feedback is not supported in the current API yet.");
    setSelected(null);
    setNotes("");
  };

  return (
    <div className="app-page grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <section className="app-panel p-5">
        <div className="mb-4">
          <span className="section-kicker">Review queue</span>
          <h1 className="mt-3 font-display text-2xl">Drafts awaiting a decision</h1>
        </div>
        <div className="space-y-2">
          {posts.length === 0 && <p className="font-serif italic text-muted-foreground">Inbox zero.</p>}
          {posts.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setNotes(p.reviewer_notes ?? ""); }}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                selected?.id === p.id ? "border-primary/40 bg-primary/6" : "border-border/60 bg-white/35 hover:bg-white/55"
              }`}
            >
              <div className="font-medium text-foreground line-clamp-2">{p.title}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {p.profiles?.display_name} / {format(new Date(p.created_at), "MMM d")}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        {selected ? (
          <div className="app-panel p-6 md:p-8">
            <div className="section-kicker">{selected.categories?.name ?? "Uncategorized"}</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{selected.title}</h2>
            <div className="mt-2 text-sm text-muted-foreground">By {selected.profiles?.display_name}</div>
            {selected.excerpt && <p className="mt-4 font-serif italic text-muted-foreground">{selected.excerpt}</p>}
            {selected.cover_image_url && <img src={selected.cover_image_url} alt="" className="mt-5 h-72 w-full rounded-[1.25rem] object-cover" />}
            <div className="prose-editorial mt-6 max-h-[28rem] overflow-auto rounded-[1.25rem] border border-border/60 bg-white/45 p-5">
              <div dangerouslySetInnerHTML={{ __html: /<\/?[a-z]/i.test(selected.content) ? selected.content : selected.content.split(/\n{2,}/).map((p) => `<p>${p.replace(/</g, "&lt;")}</p>`).join("") }} />
            </div>
            <div className="mt-6">
              <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Feedback to writer</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="field-shell mt-2 rounded-[1.1rem] border-0 shadow-none" placeholder="What needs work, or what made it great..." />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => approve(selected.slug)} className="rounded-full">Approve and publish</Button>
              <Button variant="outline" onClick={() => reject(selected.slug)} className="rounded-full bg-white/50">Send feedback</Button>
            </div>
          </div>
        ) : (
          <div className="app-panel px-6 py-14 text-center font-serif italic text-muted-foreground">
            Select a post to review.
          </div>
        )}
      </section>
    </div>
  );
}
