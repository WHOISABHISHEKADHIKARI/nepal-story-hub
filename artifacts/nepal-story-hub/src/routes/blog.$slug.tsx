import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { readingTime } from "@/lib/slug";
import { mcpApi } from "@/lib/api-mcp";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  categories?: { name: string; slug: string } | null;
  profiles?: { display_name: string; bio: string | null; avatar_url: string | null } | null;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }: { params: { slug: string } }) => {
    try {
      const res = await mcpApi.getPost(params.slug);
      if (!res.success || !res.data) throw notFound();

      const p = res.data;
      const mappedPost: Post = {
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
    } catch (err) {
      console.error("Failed to load post:", err);
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Story not found</h1>
        <p className="mt-3 font-serif text-muted-foreground">It may have been moved or unpublished.</p>
        <Link to="/blog" className="mt-6 inline-block text-primary hover:underline">
          Back to all stories
        </Link>
      </div>
    </PublicLayout>
  ),
  errorComponent: ({ error }: { error: Error }) => (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Something went wrong</h1>
        <p className="mt-3 font-serif text-muted-foreground">{error.message}</p>
      </div>
    </PublicLayout>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const minutes = readingTime(post.content);

  return (
    <PublicLayout>
      <article className="page-shell max-w-4xl pt-10 pb-20">
        <Link to="/blog" className="mb-8 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All stories
        </Link>

        {post.categories && (
          <Link
            to="/categories/$slug"
            params={{ slug: post.categories.slug }}
            className="section-kicker"
          >
            {post.categories.name}
          </Link>
        )}

        <h1 className="mt-3 font-display text-4xl leading-[1.08] text-balance md:text-6xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 font-serif text-xl italic leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-7 flex items-center gap-3 border-y border-border/60 py-4 text-sm text-muted-foreground">
          {post.profiles?.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.display_name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
              {post.profiles?.display_name?.[0] ?? "?"}
            </div>
          )}
          <div>
            <div className="font-medium text-foreground">{post.profiles?.display_name ?? "Unknown writer"}</div>
            <div className="text-xs">
              {post.published_at && format(new Date(post.published_at), "MMMM d, yyyy")}
              <span className="mx-2">/</span>
              {minutes} min read
            </div>
          </div>
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-8 w-full rounded-[1.25rem] shadow-[0_24px_60px_-40px_rgba(40,24,16,0.42)]"
            loading="eager"
          />
        )}

        <div
          className="prose-editorial mt-10"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((t: string) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs uppercase tracking-wider text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}

        {post.profiles?.bio && (
          <div className="mt-14 rounded-lg border border-border/60 bg-paper p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">About the writer</div>
            <div className="mt-1.5 font-display text-xl">{post.profiles.display_name}</div>
            <p className="mt-2 font-serif text-sm leading-relaxed text-muted-foreground">{post.profiles.bio}</p>
          </div>
        )}
      </article>
    </PublicLayout>
  );
}

function renderContent(content: string): string {
  if (/<\/?[a-z][\s\S]*>/i.test(content)) return content;
  return content
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
