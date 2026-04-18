import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";
import { useAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/new")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login", search: { redirect: "/dashboard/new" } });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
    if (!roles?.length) throw redirect({ to: "/become-contributor" });
  },
  component: NewPost,
});

function NewPost() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
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
    supabase.from("categories").select("id, name").order("name").then(({ data }) => setCats(data ?? []));
  }, []);

  const submit = async (status: "draft" | "pending" | "published") => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    if (status === "published" && !isAdmin) {
      toast.error("Only admins can publish directly.");
      return;
    }
    setBusy(true);
    const slug = `${slugify(form.title)}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("posts").insert({
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt || null,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      category_id: form.category_id || null,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      author_id: user!.id,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(status === "published" ? "Published" : status === "pending" ? "Submitted for review" : "Saved as draft");
    navigate({ to: isAdmin ? "/admin/posts" : "/" });
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); submit("pending"); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-4xl px-5 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => submit("draft")} disabled={busy}>Save draft</Button>
            {isAdmin ? (
              <Button size="sm" onClick={() => submit("published")} disabled={busy}>Publish</Button>
            ) : (
              <Button size="sm" onClick={() => submit("pending")} disabled={busy}>Submit for review</Button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-5 py-10 space-y-6">
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Story title"
          className="text-3xl md:text-4xl font-display border-0 px-0 h-auto py-2 focus-visible:ring-0 bg-transparent shadow-none"
          maxLength={200}
        />
        <Textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          placeholder="A short subtitle or excerpt (optional)"
          rows={2}
          className="text-lg font-serif italic border-0 px-0 focus-visible:ring-0 bg-transparent shadow-none resize-none"
          maxLength={300}
        />
        <Textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Tell your story… (HTML supported, or write in plain paragraphs separated by blank lines)"
          rows={20}
          className="font-serif text-lg leading-relaxed border-0 px-0 focus-visible:ring-0 bg-transparent shadow-none"
        />

        <div className="border-t border-border/60 pt-8 grid md:grid-cols-2 gap-5">
          <div>
            <Label>Cover image URL</Label>
            <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://…" />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">— Select —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="kathmandu, monsoon, harvest" />
          </div>
          <div>
            <Label>SEO meta title (optional)</Label>
            <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} maxLength={70} />
          </div>
          <div>
            <Label>SEO meta description (optional)</Label>
            <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} maxLength={160} />
          </div>
        </div>
      </form>
    </div>
  );
}
