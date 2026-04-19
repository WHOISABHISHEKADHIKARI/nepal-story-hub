import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  featured: boolean;
  category_id: string | null;
  author_id: string;
  categories?: { name: string; slug: string } | null;
  profiles?: { display_name: string } | null;
}

export function PostCard({
  post,
  variant = "default",
}: {
  post: PostListItem;
  variant?: "default" | "featured" | "compact";
}) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group editorial-panel card-lift block rounded-[1.5rem] p-4 md:p-5"
    >
      {post.cover_image_url && !isCompact && (
        <div className={`mb-5 overflow-hidden rounded-[1.1rem] bg-muted ${isFeatured ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}
      {post.categories && (
        <span className="section-kicker !gap-0 !text-[0.65rem] !tracking-[0.18em]">
          {post.categories.name}
        </span>
      )}
      <h3 className={`font-display mt-1.5 leading-tight text-balance transition-colors group-hover:text-primary ${
        isFeatured ? "text-2xl md:text-[2rem]" : "text-[1.75rem] md:text-[2.15rem]"
      }`}>
        {post.title}
      </h3>
      {post.excerpt && !isCompact && (
        <p className="mt-3 line-clamp-3 font-serif text-base leading-7 text-muted-foreground">
          {post.excerpt}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {post.profiles?.display_name && <span>By {post.profiles.display_name}</span>}
        {post.published_at && (
          <>
            <span>/</span>
            <time>{format(new Date(post.published_at), "MMM d, yyyy")}</time>
          </>
        )}
      </div>
    </Link>
  );
}
