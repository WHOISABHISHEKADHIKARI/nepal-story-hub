import { createFileRoute, useNavigate, redirect, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Feather, ImagePlus, SearchCheck } from "lucide-react";
import { mcpApi } from "@/lib/api-mcp";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/edit/$id")({
  beforeLoad: async ({ params }: { params: { id: string } }) => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: `/dashboard/edit/${params.id}` } });
  },
  loader: async ({ params }: { params: { id: string } }) => {
    const res = await mcpApi.getPost(params.id);
    if (!res.success || !res.data) throw notFound();
    return { post: res.data };
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
    excerpt: post.description ?? "",
    content: post.content,
    cover_image_url: post.image_url ?? "",
    category_id: String(post.category.id) ?? "",
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

  const save = async (newStatus?: "draft" | "pending" | "published" | "rejected") => {
    setBusy(true);
    try {
      const updates: any = {
        title: form.title.trim(),
        description: form.excerpt || null,
        content: form.content,
        image_url: form.cover_image_url || null,
        category_id: parseInt(form.category_id) || null,
      };
      if (newStatus) {
        updates.status = newStatus === "published" ? "published" : "draft";
      }
      const res = await mcpApi.updatePost(post.slug, updates);
      if (res.success) {
        toast.success("Saved");
        navigate({ to: isAdmin ? "/admin/posts" : "/dashboard" });
      } else {
        toast.error("Failed to save post");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-page max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link to={isAdmin ? "/admin/posts" : "/dashboard"} className="action-link text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="status-chip" data-status={["published", "draft", "pending"].includes(post.status) ? post.status : "default"}>
            {post.status}
          </span>
          <Button variant="outline" size="sm" onClick={() => void save()} disabled={busy} className="rounded-full bg-white/50">Save changes</Button>
          {post.status !== "published" && (
            <Button size="sm" onClick={() => void save("published")} disabled={busy} className="rounded-full">Publish now</Button>
          )}
        </div>
      </div>

      {post.reviewer_notes && (
        <div className="mb-6 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong>Editor notes:</strong> {post.reviewer_notes}
        </div>
      )}

      <div className="editor-shell">
        <div className="editor-canvas p-6 md:p-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="auth-chip"><span className="auth-orb" /> Editing live draft</span>
            <span className="auth-chip"><span className="auth-orb" /> Status {post.status}</span>
          </div>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border-0 bg-transparent px-0 py-2 text-3xl font-display shadow-none focus-visible:ring-0 md:text-5xl"
          />
          <Textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            className="mt-4 border-0 bg-transparent px-0 font-serif text-lg italic shadow-none focus-visible:ring-0 resize-none"
          />
          <Textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={20}
            className="mt-6 border-0 bg-transparent px-0 font-serif text-lg leading-relaxed shadow-none focus-visible:ring-0"
          />
        </div>

        <aside className="editor-sidebar">
          <div className="section-kicker">Story settings</div>
          <div className="mt-5 space-y-5">
            <div>
              <Label>Cover image URL</Label>
              <div className="mt-2 relative">
                <ImagePlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className="field-shell h-12 rounded-xl border-0 pl-10 shadow-none" />
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
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
            </div>
            <div>
              <Label>Meta title</Label>
              <div className="mt-2 relative">
                <SearchCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} maxLength={70} className="field-shell h-12 rounded-xl border-0 pl-10 shadow-none" />
              </div>
            </div>
            <div>
              <Label>Meta description</Label>
              <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} maxLength={160} className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
            </div>
            <div className="workspace-note">
              <div className="flex items-center gap-2 text-primary"><Feather className="h-4 w-4" /> Revision note</div>
              <p className="mt-3 text-sm leading-7">
                Tighten the first two paragraphs before adding more length. Readers decide quickly whether a travel story feels lived-in.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
