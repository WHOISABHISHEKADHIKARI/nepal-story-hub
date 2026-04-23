import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";
import { Plus, Edit, Trash2, ExternalLink, FileText, Sparkles, Clock3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/dashboard")({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session)
            throw redirect({ to: "/login", search: { redirect: "/dashboard" } });
    },
    component: ContributorDashboard,
});
function ContributorDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const draftCount = posts.filter((post) => post.status === "draft").length;
    const publishedCount = posts.filter((post) => post.status === "published").length;
    const latestPost = posts[0];
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await mcpApi.listPosts();
            setPosts(res.data || []);
        }
        catch (err) {
            console.error("Failed to load dashboard posts:", err);
            toast.error("Failed to load your stories");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    const remove = async (slug) => {
        if (!confirm("Delete this story permanently?"))
            return;
        try {
            const res = await mcpApi.deletePost(slug);
            if (res.success) {
                toast.success("Deleted");
                void load();
            }
            else {
                toast.error("Failed to delete");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    return (_jsxs("div", { className: "app-page", children: [_jsxs("section", { className: "workspace-hero px-6 py-8 md:px-8 md:py-9", children: [_jsxs("div", { className: "flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between", children: [_jsxs("div", { className: "max-w-3xl", children: [_jsx("span", { className: "section-kicker", children: "Contributor workspace" }), _jsx("h1", { className: "mt-3 font-display text-3xl md:text-5xl", children: "Your stories, drafts, and next publishable idea." }), _jsx("p", { className: "mt-3 max-w-2xl font-serif text-lg leading-8 text-muted-foreground", children: "This desk is for writing with momentum. Draft quickly, revise carefully, and jump back into the latest piece without hunting through tables." })] }), _jsxs("div", { className: "workspace-bar", children: [_jsx(Link, { to: "/dashboard/new", children: _jsxs(Button, { className: "gap-2 rounded-full px-5", children: [_jsx(Plus, { className: "h-4 w-4" }), " New story"] }) }), _jsxs("div", { className: "action-link text-sm", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Keep the draft moving"] })] })] }), _jsxs("div", { className: "workspace-metrics mt-6", children: [_jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(FileText, { className: "h-4 w-4" }), " Desk total"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: posts.length }), _jsx("div", { className: "workspace-metric-label", children: "Stories on your board" })] }), _jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Clock3, { className: "h-4 w-4" }), " In progress"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: draftCount }), _jsx("div", { className: "workspace-metric-label", children: "Drafts needing attention" })] }), _jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(ExternalLink, { className: "h-4 w-4" }), " Live now"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: publishedCount }), _jsx("div", { className: "workspace-metric-label", children: "Published stories" })] }), _jsxs("div", { className: "workspace-note", children: [_jsx("div", { className: "text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary", children: "Latest title" }), _jsx("div", { className: "mt-3 font-display text-2xl leading-tight text-foreground", children: latestPost?.title ?? "Your next story starts here" }), _jsx("div", { className: "mt-2 text-sm leading-7", children: latestPost ? `Last updated ${format(new Date(latestPost.created_at), "MMM d, yyyy")}.` : "Create a draft and this workspace starts feeling alive immediately." })] })] })] }), loading ? (_jsx("div", { className: "mt-6 grid gap-4", children: [1, 2, 3].map((i) => (_jsx("div", { className: "app-panel h-28 animate-pulse" }, i))) })) : posts.length === 0 ? (_jsxs("div", { className: "app-panel mt-6 px-6 py-14 text-center", children: [_jsx("p", { className: "font-serif italic text-muted-foreground", children: "You have not written any stories yet." }), _jsx(Link, { to: "/dashboard/new", className: "mt-5 inline-block", children: _jsx(Button, { variant: "outline", className: "rounded-full", children: "Write your first story" }) })] })) : (_jsx("div", { className: "app-panel mt-6 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "data-table min-w-[760px]", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Title" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Date" }), _jsx("th", { className: "text-right", children: "Actions" })] }) }), _jsx("tbody", { children: posts.map((p) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("div", { className: "font-medium line-clamp-1 text-foreground", children: p.title }), _jsx("div", { className: "mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground", children: p.category.name })] }), _jsx("td", { children: _jsx("span", { className: "status-chip", "data-status": ["published", "draft", "pending"].includes(p.status) ? p.status : "default", children: p.status }) }), _jsx("td", { className: "text-muted-foreground", children: format(new Date(p.created_at), "MMM d, yyyy") }), _jsx("td", { children: _jsxs("div", { className: "flex justify-end gap-2", children: [p.status === "published" && (_jsx(Link, { to: "/blog/$slug", params: { slug: p.slug }, target: "_blank", children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 rounded-full text-muted-foreground", children: _jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }) })), _jsx(Link, { to: "/dashboard/edit/$id", params: { id: p.slug }, children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 rounded-full", children: _jsx(Edit, { className: "h-3.5 w-3.5" }) }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive", onClick: () => remove(p.slug), children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] }) })] }, p.id))) })] }) }) }))] }));
}
