import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";
import { FolderOpen, Clock3, BookOpenText } from "lucide-react";
export const Route = createFileRoute("/admin/posts")({
    component: AdminPosts,
});
function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState("all");
    const publishedCount = posts.filter((post) => post.status === "published").length;
    const draftCount = posts.filter((post) => post.status === "draft").length;
    const load = useCallback(async () => {
        try {
            const res = await mcpApi.listPosts();
            const data = res.data || [];
            let mapped = data.map((p) => ({
                id: String(p.id),
                title: p.title,
                slug: p.slug,
                status: p.status,
                featured: false,
                created_at: p.created_at,
                published_at: p.published_at,
                profiles: { display_name: p.author.name },
                categories: { name: p.category.name },
            }));
            if (filter !== "all") {
                mapped = mapped.filter((p) => p.status === filter);
            }
            setPosts(mapped);
        }
        catch (err) {
            console.error("Failed to load admin posts:", err);
            toast.error("Failed to load posts");
        }
    }, [filter]);
    useEffect(() => {
        void load();
    }, [load]);
    const toggleFeatured = async (_id, _featured) => {
        toast.error("Featured status is not supported by the current API yet.");
    };
    const remove = async (slug) => {
        if (!confirm("Delete this post permanently?"))
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
    return (_jsxs("div", { className: "app-page", children: [_jsxs("section", { className: "workspace-hero px-6 py-8 md:px-8 md:py-9", children: [_jsxs("div", { className: "flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between", children: [_jsxs("div", { className: "max-w-3xl", children: [_jsx("span", { className: "section-kicker", children: "Editorial archive" }), _jsx("h1", { className: "mt-3 font-display text-3xl md:text-5xl", children: "All posts, with the queue visible at a glance." })] }), _jsx("div", { className: "workspace-bar", children: _jsx(Link, { to: "/dashboard/new", children: _jsx(Button, { className: "rounded-full px-5", children: "New post" }) }) })] }), _jsxs("div", { className: "workspace-metrics mt-6", children: [_jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(FolderOpen, { className: "h-4 w-4" }), " Filtered view"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: posts.length }), _jsx("div", { className: "workspace-metric-label", children: "Posts in this view" })] }), _jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Clock3, { className: "h-4 w-4" }), " Drafts"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: draftCount }), _jsx("div", { className: "workspace-metric-label", children: "Still in progress" })] }), _jsxs("div", { className: "workspace-note", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(BookOpenText, { className: "h-4 w-4" }), " Published cadence"] }), _jsxs("div", { className: "mt-3 font-display text-2xl leading-tight text-foreground", children: [publishedCount, " live stories"] }), _jsx("div", { className: "mt-2 text-sm leading-7", children: "Use the filter chips to move between live output and editorial backlog without losing context." })] })] })] }), _jsx("div", { className: "mt-5 mb-5 flex flex-wrap gap-2", children: ["all", "draft", "pending", "published"].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: "pill-filter", "data-active": filter === f, children: f }, f))) }), _jsx("div", { className: "app-panel overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "data-table min-w-[920px]", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Title" }), _jsx("th", { children: "Author" }), _jsx("th", { children: "Category" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Date" }), _jsx("th", { className: "text-right", children: "Actions" })] }) }), _jsxs("tbody", { children: [posts.map((p) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("div", { className: "font-medium text-foreground", children: p.title }), p.featured && _jsx("span", { className: "mt-1 inline-block text-xs uppercase tracking-[0.14em] text-primary", children: "Featured" })] }), _jsx("td", { className: "text-muted-foreground", children: p.profiles?.display_name ?? "-" }), _jsx("td", { className: "text-muted-foreground", children: p.categories?.name ?? "-" }), _jsx("td", { children: _jsx("span", { className: "status-chip", "data-status": ["published", "draft", "pending"].includes(p.status) ? p.status : "default", children: p.status }) }), _jsx("td", { className: "text-muted-foreground", children: format(new Date(p.published_at ?? p.created_at), "MMM d, yyyy") }), _jsx("td", { children: _jsxs("div", { className: "flex justify-end gap-3 text-sm", children: [p.status === "published" && (_jsx("button", { onClick: () => toggleFeatured(p.id, p.featured), className: "text-primary hover:underline", children: p.featured ? "Unfeature" : "Feature" })), _jsx(Link, { to: "/dashboard/edit/$id", params: { id: p.slug }, className: "text-primary hover:underline", children: "Edit" }), _jsx("button", { onClick: () => remove(p.slug), className: "text-destructive hover:underline", children: "Delete" })] }) })] }, p.id))), posts.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-12 text-center font-serif italic text-muted-foreground", children: "No posts in this filter." }) }))] })] }) }) })] }));
}
