import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, PenLine, BookOpen, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/")({
    component: HomePage,
});
function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [recent, setRecent] = useState([]);
    useEffect(() => {
        (async () => {
            try {
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
                setRecent(mappedPosts.slice(0, 4));
                setFeatured(mappedPosts.slice(0, 3));
            }
            catch (err) {
                console.error("Failed to fetch recent posts:", err);
            }
        })();
    }, []);
    return (_jsxs(PublicLayout, { children: [_jsxs("section", { className: "section-space relative overflow-hidden", children: [_jsx("div", { className: "soft-grid absolute inset-0 opacity-40" }), _jsxs("div", { className: "page-shell relative grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_22rem]", children: [_jsxs("div", { className: "editorial-panel rounded-[2rem] px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16", children: [_jsx("span", { className: "section-kicker mb-5", children: "A publication from Nepal" }), _jsx("h1", { className: "max-w-4xl font-display text-5xl leading-[0.98] text-balance text-foreground md:text-7xl", children: "Travel stories with the patience of a magazine and the soul of the road." }), _jsx("p", { className: "mt-6 max-w-2xl font-serif text-lg leading-8 text-muted-foreground md:text-xl", children: "From mountain villages to Kathmandu's alleys - independent journalism, travel writing, and cultural essays by Nepali voices and friends of Nepal." }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [_jsx(Link, { to: "/blog", children: _jsxs(Button, { size: "lg", className: "gap-2 rounded-full px-6 shadow-sm", children: ["Read latest stories ", _jsx(ArrowRight, { className: "h-4 w-4" })] }) }), _jsx(Link, { to: "/become-contributor", children: _jsxs(Button, { size: "lg", variant: "outline", className: "gap-2 rounded-full bg-white/50 px-6", children: [_jsx(PenLine, { className: "h-4 w-4" }), " Become a contributor"] }) })] })] }), _jsxs("aside", { className: "editorial-panel rounded-[1.75rem] p-6 sm:p-7", children: [_jsx("span", { className: "section-kicker mb-5", children: "Why readers stay" }), _jsxs("div", { className: "space-y-5", children: [_jsx(Stat, { icon: _jsx(BookOpen, { className: "h-5 w-5" }), label: "Longform pacing", value: "Deep reads" }), _jsx(Stat, { icon: _jsx(Users, { className: "h-5 w-5" }), label: "Local voices", value: "Grounded reporting" })] })] })] })] }), featured.length > 0 && (_jsx("section", { className: "section-space pt-0", children: _jsxs("div", { className: "page-shell", children: [_jsxs("div", { className: "mb-8 flex items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "section-kicker", children: "Editor's picks" }), _jsx("h2", { className: "mt-3 font-display text-3xl md:text-4xl", children: "Featured stories" })] }), _jsx(Link, { to: "/blog", className: "text-sm font-medium text-primary hover:opacity-80", children: "All stories ->" })] }), _jsx("div", { className: "grid gap-6 md:grid-cols-3", children: featured.map((p) => (_jsx(PostCard, { post: p, variant: "featured" }, p.id))) })] }) })), _jsx("section", { className: "section-space pt-0", children: _jsxs("div", { className: "page-shell", children: [_jsxs("div", { className: "mb-8 flex items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "section-kicker", children: "Fresh from the desk" }), _jsx("h2", { className: "mt-3 font-display text-3xl md:text-4xl", children: "Recent stories" })] }), _jsx(Link, { to: "/blog", className: "text-sm font-medium text-primary hover:opacity-80", children: "Browse all ->" })] }), recent.length > 0 ? (_jsx("div", { className: "grid gap-7 md:grid-cols-2", children: recent.map((p) => (_jsx(PostCard, { post: p }, p.id))) })) : (_jsx("div", { className: "editorial-panel rounded-[1.5rem] px-6 py-12 text-center md:px-10", children: _jsx("p", { className: "font-serif italic text-muted-foreground", children: "No stories published yet. Sign in as the admin to create the first one, or invite contributors." }) }))] }) }), _jsx("section", { className: "section-space pt-0", children: _jsx("div", { className: "page-shell", children: _jsxs("div", { className: "editorial-panel grid items-center gap-10 rounded-[2rem] px-6 py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:px-12 md:py-14", children: [_jsxs("div", { children: [_jsx("span", { className: "section-kicker", children: "Join the publication" }), _jsx("h2", { className: "mt-3 font-display text-3xl text-balance md:text-5xl", children: "Have a story Nepal needs to hear?" }), _jsx("p", { className: "mt-4 font-serif text-lg leading-8 text-muted-foreground", children: "We are building a home for honest, well-told stories about Nepal. If you write, apply to join. Every voice strengthens the chorus." }), _jsx(Link, { to: "/become-contributor", className: "mt-7 inline-block", children: _jsx(Button, { size: "lg", className: "rounded-full px-6", children: "Apply to write" }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsx(Stat, { icon: _jsx(BookOpen, { className: "h-5 w-5" }), label: "Published stories", value: "Growing" }), _jsx(Stat, { icon: _jsx(Users, { className: "h-5 w-5" }), label: "Contributors", value: "Welcoming" })] })] }) }) })] }));
}
function Stat({ icon, label, value }) {
    return (_jsxs("div", { className: "rounded-[1.25rem] border border-border/60 bg-white/65 p-5 backdrop-blur-sm", children: [_jsx("div", { className: "mb-3 text-primary", children: icon }), _jsx("div", { className: "font-display text-2xl leading-tight", children: value }), _jsx("div", { className: "mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground", children: label })] }));
}
