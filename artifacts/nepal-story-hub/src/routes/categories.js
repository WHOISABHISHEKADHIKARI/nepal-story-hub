import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/categories")({
    component: CategoriesIndex,
});
function CategoriesIndex() {
    const [cats, setCats] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const res = await mcpApi.listCategories();
                const data = res.data || [];
                setCats(data.map(c => ({
                    id: String(c.id),
                    name: c.name,
                    slug: c.slug,
                    description: null, // MCP doesn't have description in the simple list
                    count: 0 // We don't have counts easily available in MCP list
                })));
            }
            catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        })();
    }, []);
    return (_jsx(PublicLayout, { children: _jsxs("div", { className: "mx-auto max-w-5xl px-5 py-16", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-primary font-semibold", children: "Sections" }), _jsx("h1", { className: "font-display text-4xl md:text-5xl mt-2", children: "Categories" }), _jsx("p", { className: "mt-4 text-muted-foreground font-serif text-lg max-w-2xl", children: "Stories sorted by what they're really about." }), _jsxs("div", { className: "mt-12 grid gap-5 md:grid-cols-2", children: [cats.map((c) => (_jsxs(Link, { to: "/categories/$slug", params: { slug: c.slug }, className: "group block p-6 bg-card border border-border/60 rounded-lg hover:border-primary/50 transition-colors", children: [_jsxs("div", { className: "flex items-baseline justify-between", children: [_jsx("h2", { className: "font-display text-2xl group-hover:text-primary transition-colors", children: c.name }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [c.count, " ", c.count === 1 ? "story" : "stories"] })] }), c.description && _jsx("p", { className: "mt-2 text-sm text-muted-foreground font-serif", children: c.description })] }, c.id))), cats.length === 0 && (_jsx("div", { className: "md:col-span-2 border border-dashed border-border rounded-lg p-12 text-center", children: _jsx("p", { className: "text-muted-foreground font-serif italic", children: "No categories yet. An admin can add them from the dashboard." }) }))] })] }) }));
}
