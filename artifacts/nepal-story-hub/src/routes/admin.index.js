import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Inbox, Users, CheckCircle2, Compass, Newspaper } from "lucide-react";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/admin/")({
    component: AdminOverview,
});
function AdminOverview() {
    const [stats, setStats] = useState({ posts: 0, pending: 0, contributors: 0, requests: 0 });
    useEffect(() => {
        (async () => {
            try {
                const [pubRes, authRes] = await Promise.all([
                    mcpApi.listPosts(),
                    mcpApi.listAuthors(),
                ]);
                const posts = pubRes.data || [];
                const authors = authRes.data || [];
                setStats({
                    posts: posts.filter((p) => p.status === "published").length,
                    pending: posts.filter((p) => p.status === "draft").length,
                    contributors: authors.length,
                    requests: 0,
                });
            }
            catch (err) {
                console.error("Failed to fetch admin stats:", err);
            }
        })();
    }, []);
    return (_jsxs("div", { className: "app-page", children: [_jsxs("section", { className: "workspace-hero px-6 py-8 md:px-8 md:py-9", children: [_jsx("span", { className: "section-kicker", children: "Admin overview" }), _jsxs("div", { className: "mt-3 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_20rem]", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-3xl md:text-5xl", children: "Publication snapshot with the right amount of urgency." }), _jsx("p", { className: "mt-3 max-w-2xl font-serif text-lg leading-8 text-muted-foreground", children: "This view should tell an editor what needs attention in under ten seconds: what is live, what is waiting, and where the next bottleneck is forming." })] }), _jsxs("div", { className: "workspace-note", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Compass, { className: "h-4 w-4" }), " Editorial direction"] }), _jsx("div", { className: "mt-3 font-display text-2xl leading-tight text-foreground", children: stats.pending > 0 ? "Review queue needs attention" : "Desk is clear" }), _jsx("div", { className: "mt-2 text-sm leading-7", children: stats.pending > 0 ? `${stats.pending} drafts are waiting for a decision.` : "No draft backlog right now, so you can focus on quality and cadence." })] })] }), _jsxs("div", { className: "workspace-metrics mt-6", children: [_jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), " Published"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: stats.posts }), _jsx("div", { className: "workspace-metric-label", children: "Stories currently live" })] }), _jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Inbox, { className: "h-4 w-4" }), " Pending"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: stats.pending }), _jsx("div", { className: "workspace-metric-label", children: "Drafts to review" })] }), _jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Newspaper, { className: "h-4 w-4" }), " Requests"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: stats.requests }), _jsx("div", { className: "workspace-metric-label", children: "Open contributor requests" })] }), _jsxs("div", { className: "workspace-metric", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx(Users, { className: "h-4 w-4" }), " Contributors"] }), _jsx("div", { className: "workspace-metric-value mt-3", children: stats.contributors }), _jsx("div", { className: "workspace-metric-label", children: "Writers on the roster" })] })] })] }), _jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(Stat, { icon: CheckCircle2, label: "Published", value: stats.posts }), _jsx(Stat, { icon: Inbox, label: "Pending review", value: stats.pending, accent: true }), _jsx(Stat, { icon: FileText, label: "Open requests", value: stats.requests, accent: true }), _jsx(Stat, { icon: Users, label: "Contributors", value: stats.contributors })] })] }));
}
function Stat({ icon: Icon, label, value, accent }) {
    return (_jsxs("div", { className: `admin-stat ${accent && value > 0 ? "border-primary/30 bg-primary/5" : ""}`, children: [_jsx(Icon, { className: `h-5 w-5 ${accent && value > 0 ? "text-primary" : "text-muted-foreground"}` }), _jsx("div", { className: "mt-3 font-display text-4xl leading-none", children: value }), _jsx("div", { className: "mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground", children: label })] }));
}
