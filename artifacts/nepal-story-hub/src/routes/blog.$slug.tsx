import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { readingTime } from "@/lib/slug";

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
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, content, cover_image_url, published_at, meta_title, meta_description, tags, categories(name, slug), profiles(display_name, bio, avatar_url)")
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) throw notFound();
    return { post: data as unknown as Post };
  },
  notFoundComponent: () => (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Story not found</h1>
        <p className="mt-3 text-muted-foreground font-serif">It may have been moved or unpublished.</p>
        <Link to="/blog" className="inline-block mt-6 text-primary hover:underline">
          ← Back to all stories
        </Link>
      </div>
    </PublicLayout>
  ),
  errorComponent: ({ error }) => (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground font-serif">{error.message}</p>
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
      <article className="mx-auto max-w-3xl px-5 pt-10 pb-20">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> All stories
        </Link>

        {post.categories && (
          <Link
            to="/categories/$slug"
            params={{ slug: post.categories.slug }}
            className="text-xs uppercase tracking-[0.2em] text-primary font-semibold"
          >
            {post.categories.name}
          </Link>
        )}

        <h1 className="font-display text-4xl md:text-6xl mt-3 leading-[1.08] text-balance">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 text-xl font-serif italic text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground border-y border-border/60 py-4">
          {post.profiles?.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.display_name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display text-lg">
              {post.profiles?.display_name?.[0] ?? "?"}
            </div>
          )}
          <div>
            <div className="font-medium text-foreground">{post.profiles?.display_name ?? "Unknown writer"}</div>
            <div className="text-xs">
              {post.published_at && format(new Date(post.published_at), "MMMM d, yyyy")}
              <span className="mx-2">·</span>
              {minutes} min read
            </div>
          </div>
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-8 w-full rounded-md"
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
              <span key={t} className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}

        {post.profiles?.bio && (
          <div className="mt-14 p-6 bg-paper border border-border/60 rounded-lg">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">About the writer</div>
            <div className="font-display text-xl mt-1.5">{post.profiles.display_name}</div>
            <p className="mt-2 text-sm text-muted-foreground font-serif leading-relaxed">{post.profiles.bio}</p>
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
