import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { readingTime } from "@/lib/slug";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/blog/$slug")({
    loader: async ({ params }) => {
        try {
            const res = await mcpApi.getPost(params.slug);
            if (!res.success || !res.data)
                throw notFound();
            const p = res.data;
            const mappedPost = {
                id: String(p.id),
                slug: p.slug,
                title: p.title,
                excerpt: p.description,
                content: p.content,
                cover_image_url: p.image_url,
                published_at: p.published_at,
                meta_title: null,
                meta_description: null,
                tags: [],
                categories: { name: p.category.name, slug: p.category.slug },
                profiles: { display_name: p.author.name, bio: null, avatar_url: null },
            };
            return { post: mappedPost };
        }
        catch (err) {
            console.error("Failed to load post:", err);
            throw notFound();
        }
    },
    notFoundComponent: () => (_jsx(PublicLayout, { children: _jsxs("div", { className: "mx-auto max-w-2xl px-5 py-24 text-center", children: [_jsx("h1", { className: "font-display text-4xl", children: "Story not found" }), _jsx("p", { className: "mt-3 font-serif text-muted-foreground", children: "It may have been moved or unpublished." }), _jsx(Link, { to: "/blog", className: "mt-6 inline-block text-primary hover:underline", children: "Back to all stories" })] }) })),
    errorComponent: ({ error }) => (_jsx(PublicLayout, { children: _jsxs("div", { className: "mx-auto max-w-2xl px-5 py-24 text-center", children: [_jsx("h1", { className: "font-display text-4xl", children: "Something went wrong" }), _jsx("p", { className: "mt-3 font-serif text-muted-foreground", children: error.message })] }) })),
    component: PostPage,
});
function PostPage() {
    const { post } = Route.useLoaderData();
    const minutes = readingTime(post.content);
    return (_jsx(PublicLayout, { children: _jsxs("article", { className: "page-shell max-w-4xl pt-10 pb-20", children: [_jsxs(Link, { to: "/blog", className: "mb-8 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground", children: [_jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), " All stories"] }), post.categories && (_jsx(Link, { to: "/categories/$slug", params: { slug: post.categories.slug }, className: "section-kicker", children: post.categories.name })), _jsx("h1", { className: "mt-3 font-display text-4xl leading-[1.08] text-balance md:text-6xl", children: post.title }), post.excerpt && (_jsx("p", { className: "mt-5 font-serif text-xl italic leading-relaxed text-muted-foreground", children: post.excerpt })), _jsxs("div", { className: "mt-7 flex items-center gap-3 border-y border-border/60 py-4 text-sm text-muted-foreground", children: [post.profiles?.avatar_url ? (_jsx("img", { src: post.profiles.avatar_url, alt: post.profiles.display_name, className: "h-10 w-10 rounded-full object-cover" })) : (_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary", children: post.profiles?.display_name?.[0] ?? "?" })), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-foreground", children: post.profiles?.display_name ?? "Unknown writer" }), _jsxs("div", { className: "text-xs", children: [post.published_at && format(new Date(post.published_at), "MMMM d, yyyy"), _jsx("span", { className: "mx-2", children: "/" }), minutes, " min read"] })] })] }), post.cover_image_url && (_jsx("img", { src: post.cover_image_url, alt: post.title, className: "mt-8 w-full rounded-[1.25rem] shadow-[0_24px_60px_-40px_rgba(40,24,16,0.42)]", loading: "eager" })), _jsx("div", { className: "prose-editorial mt-10", dangerouslySetInnerHTML: { __html: renderContent(post.content) } }), post.tags && post.tags.length > 0 && (_jsx("div", { className: "mt-12 flex flex-wrap gap-2", children: post.tags.map((t) => (_jsx("span", { className: "rounded-full bg-muted px-2.5 py-1 text-xs uppercase tracking-wider text-muted-foreground", children: t }, t))) })), post.profiles?.bio && (_jsxs("div", { className: "mt-14 rounded-lg border border-border/60 bg-paper p-6", children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "About the writer" }), _jsx("div", { className: "mt-1.5 font-display text-xl", children: post.profiles.display_name }), _jsx("p", { className: "mt-2 font-serif text-sm leading-relaxed text-muted-foreground", children: post.profiles.bio })] }))] }) }));
}
function renderContent(content) {
    if (/<\/?[a-z][\s\S]*>/i.test(content))
        return content;
    return content
        .split(/\n{2,}/)
        .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br />")}</p>`)
        .join("\n");
}
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
