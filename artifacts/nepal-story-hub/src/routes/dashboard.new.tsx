import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Feather, ImagePlus, SearchCheck } from "lucide-react";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/dashboard/new")({
  beforeLoad: async () => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: "/dashboard/new" } });
  },
  component: NewPost,
});

function NewPost() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    category_id: "",
    tags: "",
    meta_title: "",
    meta_description: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void mcpApi.listCategories().then((res) => {
      const data = res.data || [];
      setCats(data.map((c) => ({ id: String(c.id), name: c.name })));
    });
  }, []);

  const submit = async (status: "draft" | "pending" | "published") => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setBusy(true);
    try {
      const res = await mcpApi.createPost({
        project_id: 46,
        title: form.title.trim(),
        description: form.excerpt,
        content: form.content,
        category_id: parseInt(form.category_id) || 46,
        author_id: 41,
        status: status === "published" ? "published" : "draft",
        meta_title: form.meta_title,
        meta_description: form.meta_description,
      });

      if (res.success) {
        toast.success(status === "published" ? "Published" : status === "pending" ? "Submitted for review" : "Saved as draft");
        navigate({ to: isAdmin ? "/admin/posts" : "/dashboard" });
      } else {
        toast.error("Failed to create post");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit("pending");
  };

  return (
    <div className="app-page max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link to="/dashboard" className="action-link text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void submit("draft")} disabled={busy} className="rounded-full bg-white/50">Save draft</Button>
          <Button size="sm" onClick={() => void submit("published")} disabled={busy} className="rounded-full">Publish</Button>
        </div>
      </div>

      <div className="editor-shell">
        <form onSubmit={handleSubmit} className="editor-canvas p-6 md:p-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="auth-chip"><span className="auth-orb" /> Draft room</span>
            <span className="auth-chip"><span className="auth-orb" /> Longform editor</span>
          </div>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Story title"
            className="border-0 bg-transparent px-0 py-2 text-3xl font-display shadow-none focus-visible:ring-0 md:text-5xl"
            maxLength={200}
          />
          <Textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="A sharp dek or short excerpt that makes the reader keep going."
            rows={2}
            className="mt-4 border-0 bg-transparent px-0 font-serif text-lg italic shadow-none focus-visible:ring-0 resize-none"
            maxLength={300}
          />
          <Textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Tell your story... HTML is supported, or write in plain paragraphs separated by blank lines."
            rows={20}
            className="mt-6 border-0 bg-transparent px-0 font-serif text-lg leading-relaxed shadow-none focus-visible:ring-0"
          />
        </form>

        <aside className="editor-sidebar">
          <div className="section-kicker">Story settings</div>
          <div className="mt-5 space-y-5">
            <div>
              <Label>Cover image URL</Label>
              <div className="mt-2 relative">
                <ImagePlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://..." className="field-shell h-12 rounded-xl border-0 pl-10 shadow-none" />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="field-shell mt-2 flex h-12 w-full rounded-xl border-0 bg-transparent px-3 text-sm shadow-none"
              >
                <option value="">Select a category</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Tags</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="kathmandu, monsoon, harvest" className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
            </div>
            <div>
              <Label>SEO meta title</Label>
              <div className="mt-2 relative">
                <SearchCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} maxLength={70} className="field-shell h-12 rounded-xl border-0 pl-10 shadow-none" />
              </div>
            </div>
            <div>
              <Label>SEO meta description</Label>
              <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} maxLength={160} className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
            </div>
            <div className="workspace-note">
              <div className="flex items-center gap-2 text-primary"><Feather className="h-4 w-4" /> Editorial reminder</div>
              <p className="mt-3 text-sm leading-7">
                Lead with the scene, then widen the lens. The strongest travel stories feel observed before they feel explained.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
