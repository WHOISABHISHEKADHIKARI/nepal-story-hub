import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { PostCard } from "@/components/PostCard";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/categories/$slug")({
    loader: async ({ params }) => {
        try {
            const res = await mcpApi.listCategories();
            const cat = res.data?.find(c => c.slug === params.slug);
            if (!cat)
                throw notFound();
            return { category: { ...cat, id: String(cat.id), description: null } };
        }
        catch (err) {
            throw notFound();
        }
    },
    notFoundComponent: () => (_jsx(PublicLayout, { children: _jsx("div", { className: "mx-auto max-w-2xl px-5 py-24 text-center", children: _jsx("h1", { className: "font-display text-3xl", children: "Category not found" }) }) })),
    component: CategoryPage,
});
function CategoryPage() {
    const { category } = Route.useLoaderData();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await mcpApi.listPosts();
                const data = res.data || [];
                const filtered = data
                    .filter(p => String(p.category.id) === category.id)
                    .map(p => ({
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
                    profiles: { display_name: p.author.name }
                }));
                setPosts(filtered);
            }
            catch (err) {
                console.error("Failed to load category posts:", err);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [category.id]);
    return (_jsx(PublicLayout, { children: _jsxs("div", { className: "mx-auto max-w-6xl px-5 py-12", children: [_jsxs(Link, { to: "/categories", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), " All categories"] }), _jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-primary font-semibold", children: "Section" }), _jsx("h1", { className: "font-display text-4xl md:text-5xl mt-2", children: category.name }), category.description && _jsx("p", { className: "mt-3 text-muted-foreground font-serif text-lg max-w-2xl", children: category.description }), _jsx("div", { className: "mt-12", children: posts.length === 0 ? (_jsx("p", { className: "text-muted-foreground italic font-serif", children: "No stories in this section yet." })) : (_jsx("div", { className: "grid gap-12 md:grid-cols-2", children: posts.map((p) => _jsx(PostCard, { post: p }, p.id)) })) })] }) }));
}
