import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/admin/review")({
    component: ReviewQueue,
});
function ReviewQueue() {
    const [posts, setPosts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [notes, setNotes] = useState("");
    const load = useCallback(async () => {
        try {
            const res = await mcpApi.listPosts();
            const data = res.data || [];
            const pending = data
                .filter((p) => p.status === "draft")
                .map((p) => ({
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
        }
        catch (err) {
            console.error("Failed to load review queue:", err);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    const approve = async (slug) => {
        try {
            const res = await mcpApi.publishPost(slug);
            if (res.success) {
                toast.success("Published");
                setSelected(null);
                setNotes("");
                void load();
            }
            else {
                toast.error("Failed to publish");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const reject = async (_slug) => {
        toast.error("Rejection with feedback is not supported in the current API yet.");
        setSelected(null);
        setNotes("");
    };
    return (_jsxs("div", { className: "app-page grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]", children: [_jsxs("section", { className: "app-panel p-5", children: [_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "section-kicker", children: "Review queue" }), _jsx("h1", { className: "mt-3 font-display text-2xl", children: "Drafts awaiting a decision" })] }), _jsxs("div", { className: "space-y-2", children: [posts.length === 0 && _jsx("p", { className: "font-serif italic text-muted-foreground", children: "Inbox zero." }), posts.map((p) => (_jsxs("button", { onClick: () => { setSelected(p); setNotes(p.reviewer_notes ?? ""); }, className: `w-full rounded-2xl border p-4 text-left transition-colors ${selected?.id === p.id ? "border-primary/40 bg-primary/6" : "border-border/60 bg-white/35 hover:bg-white/55"}`, children: [_jsx("div", { className: "font-medium text-foreground line-clamp-2", children: p.title }), _jsxs("div", { className: "mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground", children: [p.profiles?.display_name, " / ", format(new Date(p.created_at), "MMM d")] })] }, p.id)))] })] }), _jsx("section", { children: selected ? (_jsxs("div", { className: "app-panel p-6 md:p-8", children: [_jsx("div", { className: "section-kicker", children: selected.categories?.name ?? "Uncategorized" }), _jsx("h2", { className: "mt-3 font-display text-3xl md:text-4xl", children: selected.title }), _jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: ["By ", selected.profiles?.display_name] }), selected.excerpt && _jsx("p", { className: "mt-4 font-serif italic text-muted-foreground", children: selected.excerpt }), selected.cover_image_url && _jsx("img", { src: selected.cover_image_url, alt: "", className: "mt-5 h-72 w-full rounded-[1.25rem] object-cover" }), _jsx("div", { className: "prose-editorial mt-6 max-h-[28rem] overflow-auto rounded-[1.25rem] border border-border/60 bg-white/45 p-5", children: _jsx("div", { dangerouslySetInnerHTML: { __html: /<\/?[a-z]/i.test(selected.content) ? selected.content : selected.content.split(/\n{2,}/).map((p) => `<p>${p.replace(/</g, "&lt;")}</p>`).join("") } }) }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "text-xs uppercase tracking-[0.16em] text-muted-foreground", children: "Feedback to writer" }), _jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), rows: 4, className: "field-shell mt-2 rounded-[1.1rem] border-0 shadow-none", placeholder: "What needs work, or what made it great..." })] }), _jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [_jsx(Button, { onClick: () => approve(selected.slug), className: "rounded-full", children: "Approve and publish" }), _jsx(Button, { variant: "outline", onClick: () => reject(selected.slug), className: "rounded-full bg-white/50", children: "Send feedback" })] })] })) : (_jsx("div", { className: "app-panel px-6 py-14 text-center font-serif italic text-muted-foreground", children: "Select a post to review." })) })] }));
}
