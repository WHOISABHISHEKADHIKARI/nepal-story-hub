import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session)
            throw redirect({ to: "/login", search: { redirect: "/dashboard/new" } });
    },
    component: NewPost,
});
function NewPost() {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [cats, setCats] = useState([]);
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
    const submit = async (status) => {
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
            }
            else {
                toast.error("Failed to create post");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        void submit("pending");
    };
    return (_jsxs("div", { className: "app-page max-w-5xl", children: [_jsxs("div", { className: "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs(Link, { to: "/dashboard", className: "action-link text-sm", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to dashboard"] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => void submit("draft"), disabled: busy, className: "rounded-full bg-white/50", children: "Save draft" }), _jsx(Button, { size: "sm", onClick: () => void submit("published"), disabled: busy, className: "rounded-full", children: "Publish" })] })] }), _jsxs("div", { className: "editor-shell", children: [_jsxs("form", { onSubmit: handleSubmit, className: "editor-canvas p-6 md:p-8", children: [_jsxs("div", { className: "mb-6 flex flex-wrap gap-2", children: [_jsxs("span", { className: "auth-chip", children: [_jsx("span", { className: "auth-orb" }), " Draft room"] }), _jsxs("span", { className: "auth-chip", children: [_jsx("span", { className: "auth-orb" }), " Longform editor"] })] }), _jsx(Input, { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: "Story title", className: "border-0 bg-transparent px-0 py-2 text-3xl font-display shadow-none focus-visible:ring-0 md:text-5xl", maxLength: 200 }), _jsx(Textarea, { value: form.excerpt, onChange: (e) => setForm({ ...form, excerpt: e.target.value }), placeholder: "A sharp dek or short excerpt that makes the reader keep going.", rows: 2, className: "mt-4 border-0 bg-transparent px-0 font-serif text-lg italic shadow-none focus-visible:ring-0 resize-none", maxLength: 300 }), _jsx(Textarea, { value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), placeholder: "Tell your story... HTML is supported, or write in plain paragraphs separated by blank lines.", rows: 20, className: "mt-6 border-0 bg-transparent px-0 font-serif text-lg leading-relaxed shadow-none focus-visible:ring-0" })] }), _jsxs("aside", { className: "editor-sidebar", children: [_jsx("div", { className: "section-kicker", children: "Story settings" }), _jsxs("div", { className: "mt-5 space-y-5", children: [_jsxs("div", { children: [_jsx(Label, { children: "Cover image URL" }), _jsxs("div", { className: "mt-2 relative", children: [_jsx(ImagePlus, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { value: form.cover_image_url, onChange: (e) => setForm({ ...form, cover_image_url: e.target.value }), placeholder: "https://...", className: "field-shell h-12 rounded-xl border-0 pl-10 shadow-none" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Category" }), _jsxs("select", { value: form.category_id, onChange: (e) => setForm({ ...form, category_id: e.target.value }), className: "field-shell mt-2 flex h-12 w-full rounded-xl border-0 bg-transparent px-3 text-sm shadow-none", children: [_jsx("option", { value: "", children: "Select a category" }), cats.map((c) => _jsx("option", { value: c.id, children: c.name }, c.id))] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tags" }), _jsx(Input, { value: form.tags, onChange: (e) => setForm({ ...form, tags: e.target.value }), placeholder: "kathmandu, monsoon, harvest", className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { children: "SEO meta title" }), _jsxs("div", { className: "mt-2 relative", children: [_jsx(SearchCheck, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { value: form.meta_title, onChange: (e) => setForm({ ...form, meta_title: e.target.value }), maxLength: 70, className: "field-shell h-12 rounded-xl border-0 pl-10 shadow-none" })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "SEO meta description" }), _jsx(Input, { value: form.meta_description, onChange: (e) => setForm({ ...form, meta_description: e.target.value }), maxLength: 160, className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { className: "workspace-note", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Feather, { className: "h-4 w-4" }), " Editorial reminder"] }), _jsx("p", { className: "mt-3 text-sm leading-7", children: "Lead with the scene, then widen the lens. The strongest travel stories feel observed before they feel explained." })] })] })] })] })] }));
}
