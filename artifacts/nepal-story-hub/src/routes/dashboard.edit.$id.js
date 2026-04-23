import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    beforeLoad: async ({ params }) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session)
            throw redirect({ to: "/login", search: { redirect: `/dashboard/edit/${params.id}` } });
    },
    loader: async ({ params }) => {
        const res = await mcpApi.getPost(params.id);
        if (!res.success || !res.data)
            throw notFound();
        return { post: res.data };
    },
    notFoundComponent: () => _jsx("div", { className: "p-12 text-center", children: "Post not found." }),
    component: EditPost,
});
function EditPost() {
    const { post } = Route.useLoaderData();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [cats, setCats] = useState([]);
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
    const save = async (newStatus) => {
        setBusy(true);
        try {
            const updates = {
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
            }
            else {
                toast.error("Failed to save post");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsxs("div", { className: "app-page max-w-5xl", children: [_jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs(Link, { to: isAdmin ? "/admin/posts" : "/dashboard", className: "action-link text-sm", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back"] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "status-chip", "data-status": ["published", "draft", "pending"].includes(post.status) ? post.status : "default", children: post.status }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => void save(), disabled: busy, className: "rounded-full bg-white/50", children: "Save changes" }), post.status !== "published" && (_jsx(Button, { size: "sm", onClick: () => void save("published"), disabled: busy, className: "rounded-full", children: "Publish now" }))] })] }), post.reviewer_notes && (_jsxs("div", { className: "mb-6 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900", children: [_jsx("strong", { children: "Editor notes:" }), " ", post.reviewer_notes] })), _jsxs("div", { className: "editor-shell", children: [_jsxs("div", { className: "editor-canvas p-6 md:p-8", children: [_jsxs("div", { className: "mb-6 flex flex-wrap gap-2", children: [_jsxs("span", { className: "auth-chip", children: [_jsx("span", { className: "auth-orb" }), " Editing live draft"] }), _jsxs("span", { className: "auth-chip", children: [_jsx("span", { className: "auth-orb" }), " Status ", post.status] })] }), _jsx(Input, { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: "border-0 bg-transparent px-0 py-2 text-3xl font-display shadow-none focus-visible:ring-0 md:text-5xl" }), _jsx(Textarea, { value: form.excerpt, onChange: (e) => setForm({ ...form, excerpt: e.target.value }), rows: 2, className: "mt-4 border-0 bg-transparent px-0 font-serif text-lg italic shadow-none focus-visible:ring-0 resize-none" }), _jsx(Textarea, { value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), rows: 20, className: "mt-6 border-0 bg-transparent px-0 font-serif text-lg leading-relaxed shadow-none focus-visible:ring-0" })] }), _jsxs("aside", { className: "editor-sidebar", children: [_jsx("div", { className: "section-kicker", children: "Story settings" }), _jsxs("div", { className: "mt-5 space-y-5", children: [_jsxs("div", { children: [_jsx(Label, { children: "Cover image URL" }), _jsxs("div", { className: "mt-2 relative", children: [_jsx(ImagePlus, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { value: form.cover_image_url, onChange: (e) => setForm({ ...form, cover_image_url: e.target.value }), className: "field-shell h-12 rounded-xl border-0 pl-10 shadow-none" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Category" }), _jsxs("select", { value: form.category_id, onChange: (e) => setForm({ ...form, category_id: e.target.value }), className: "field-shell mt-2 flex h-12 w-full rounded-xl border-0 bg-transparent px-3 text-sm shadow-none", children: [_jsx("option", { value: "", children: "Select a category" }), cats.map((c) => _jsx("option", { value: c.id, children: c.name }, c.id))] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tags" }), _jsx(Input, { value: form.tags, onChange: (e) => setForm({ ...form, tags: e.target.value }), className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Meta title" }), _jsxs("div", { className: "mt-2 relative", children: [_jsx(SearchCheck, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { value: form.meta_title, onChange: (e) => setForm({ ...form, meta_title: e.target.value }), maxLength: 70, className: "field-shell h-12 rounded-xl border-0 pl-10 shadow-none" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Meta description" }), _jsx(Input, { value: form.meta_description, onChange: (e) => setForm({ ...form, meta_description: e.target.value }), maxLength: 160, className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { className: "workspace-note", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Feather, { className: "h-4 w-4" }), " Revision note"] }), _jsx("p", { className: "mt-3 text-sm leading-7", children: "Tighten the first two paragraphs before adding more length. Readers decide quickly whether a travel story feels lived-in." })] })] })] })] })] }));
}
