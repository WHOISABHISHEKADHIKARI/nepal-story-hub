import { createFileRoute, useNavigate, redirect, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/edit/$id")({
  beforeLoad: async ({ params }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login", search: { redirect: `/dashboard/edit/${params.id}` } });
  },
  loader: async ({ params }) => {
    const { data } = await supabase.from("posts").select("*").eq("id", params.id).maybeSingle();
    if (!data) throw notFound();
    return { post: data };
  },
  notFoundComponent: () => <div className="p-12 text-center">Post not found.</div>,
  component: EditPost,
});

function EditPost() {
  const { post } = Route.useLoaderData();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    cover_image_url: post.cover_image_url ?? "",
    category_id: post.category_id ?? "",
    tags: (post.tags ?? []).join(", "),
    meta_title: post.meta_title ?? "",
    meta_description: post.meta_description ?? "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("id, name").order("name").then(({ data }) => setCats(data ?? []));
  }, []);

  const save = async (newStatus?: "draft" | "pending" | "published" | "rejected") => {
    setBusy(true);
    const updates: {
      title: string;
      excerpt: string | null;
      content: string;
      cover_image_url: string | null;
      category_id: string | null;
      tags: string[];
      meta_title: string | null;
      meta_description: string | null;
      status?: "draft" | "pending" | "published" | "rejected";
      published_at?: string;
    } = {
      title: form.title.trim(),
      excerpt: form.excerpt || null,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      category_id: form.category_id || null,
      tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    };
    if (newStatus) {
      updates.status = newStatus;
      if (newStatus === "published" && !post.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }
    const { error } = await supabase.from("posts").update(updates).eq("id", post.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    navigate({ to: isAdmin ? "/admin/posts" : "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-4xl px-5 py-4 flex justify-between items-center">
          <Link to={isAdmin ? "/admin/posts" : "/"} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex gap-2">
            <span className="text-xs text-muted-foreground self-center">Status: {post.status}</span>
            <Button variant="outline" size="sm" onClick={() => save()} disabled={busy}>Save changes</Button>
            {isAdmin && post.status !== "published" && (
              <Button size="sm" onClick={() => save("published")} disabled={busy}>Publish now</Button>
            )}
          </div>
        </div>
      </div>

      {post.reviewer_notes && (
        <div className="mx-auto max-w-3xl px-5 mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-md text-sm">
          <strong>Editor notes:</strong> {post.reviewer_notes}
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-10 space-y-6">
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="text-3xl md:text-4xl font-display border-0 px-0 h-auto py-2 focus-visible:ring-0 bg-transparent shadow-none"
        />
        <Textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="text-lg font-serif italic border-0 px-0 focus-visible:ring-0 bg-transparent shadow-none resize-none"
        />
        <Textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={20}
          className="font-serif text-lg leading-relaxed border-0 px-0 focus-visible:ring-0 bg-transparent shadow-none"
        />

        <div className="border-t border-border/60 pt-8 grid md:grid-cols-2 gap-5">
          <div>
            <Label>Cover image URL</Label>
            <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
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
            <Label>Tags</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div>
            <Label>Meta title</Label>
            <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} maxLength={70} />
          </div>
          <div>
            <Label>Meta description</Label>
            <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} maxLength={160} />
          </div>
        </div>
      </div>
    </div>
  );
}
