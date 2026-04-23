import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/blog")({
    component: BlogIndex,
});
function BlogIndex() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCat, setActiveCat] = useState(null);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const catsRes = await mcpApi.listCategories();
                const catsData = catsRes.data || [];
                setCategories(catsData.map((c) => ({ id: String(c.id), name: c.name, slug: c.slug })));
                const postsRes = await mcpApi.listPosts();
                const postsData = postsRes.data || [];
                const mappedPosts = postsData.map((p) => ({
                    id: String(p.id),
                    slug: p.slug,
                    title: p.title,
                    excerpt: p.description,
                    cover_image_url: p.image_url,
                    published_at: p.published_at,
                    featured: false,
                    category_id: String(p.category.id),
                    author_id: String(p.author.id),
                    categories: { name: p.category.name, slug: p.category.slug },
                    profiles: { display_name: p.author.name },
                }));
                setPosts(mappedPosts);
            }
            catch (err) {
                console.error("Failed to fetch blog data:", err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    const filtered = posts.filter((p) => {
        const matchesCategory = activeCat ? p.category_id === activeCat : true;
        const query = q.trim().toLowerCase();
        const matchesQuery = query
            ? p.title.toLowerCase().includes(query) || p.excerpt?.toLowerCase().includes(query)
            : true;
        return matchesCategory && matchesQuery;
    });
    return (_jsx(PublicLayout, { children: _jsxs("div", { className: "page-shell section-space", children: [_jsxs("div", { className: "mb-10 max-w-3xl", children: [_jsx("span", { className: "section-kicker", children: "Stories" }), _jsx("h1", { className: "mt-3 font-display text-4xl md:text-6xl", children: "Every story we have published." }), _jsx("p", { className: "mt-4 font-serif text-lg leading-8 text-muted-foreground", children: "Browse the full archive like a travel magazine: by place, by mood, or by the question you brought with you." })] }), _jsx("div", { className: "editorial-panel mb-10 rounded-[1.75rem] p-5 md:p-6", children: _jsxs("div", { className: "flex flex-col items-stretch gap-4 md:flex-row md:items-center", children: [_jsxs("div", { className: "relative flex-1 md:max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { placeholder: "Search stories...", value: q, onChange: (e) => setQ(e.target.value), className: "field-shell h-12 rounded-full border-0 bg-transparent pl-10 pr-4 shadow-none" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => setActiveCat(null), className: "pill-filter", "data-active": activeCat === null, children: "All" }), categories.map((c) => (_jsx("button", { onClick: () => setActiveCat(c.id), className: "pill-filter", "data-active": activeCat === c.id, children: c.name }, c.id)))] })] }) }), loading ? (_jsx("div", { className: "editorial-panel rounded-[1.5rem] px-6 py-12 text-center", children: _jsx("p", { className: "font-serif italic text-muted-foreground", children: "Loading..." }) })) : filtered.length === 0 ? (_jsx("div", { className: "editorial-panel rounded-[1.5rem] px-6 py-12 text-center", children: _jsx("p", { className: "font-serif italic text-muted-foreground", children: "No stories match this section yet." }) })) : (_jsx("div", { className: "grid gap-7 md:grid-cols-2", children: filtered.map((p) => (_jsx(PostCard, { post: p }, p.id))) }))] }) }));
}
