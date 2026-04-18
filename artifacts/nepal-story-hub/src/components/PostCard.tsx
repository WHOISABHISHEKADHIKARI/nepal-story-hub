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
      className="group block"
    >
      {post.cover_image_url && !isCompact && (
        <div className={`overflow-hidden rounded-md mb-4 bg-muted ${isFeatured ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}
      {post.categories && (
        <span className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">
          {post.categories.name}
        </span>
      )}
      <h3 className={`font-display mt-1.5 leading-tight text-balance group-hover:text-primary transition-colors ${
        isFeatured ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
      }`}>
        {post.title}
      </h3>
      {post.excerpt && !isCompact && (
        <p className="mt-2.5 text-muted-foreground font-serif leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="mt-3 text-xs text-muted-foreground">
        {post.profiles?.display_name && <span>By {post.profiles.display_name}</span>}
        {post.published_at && (
          <>
            <span className="mx-2">·</span>
            <time>{format(new Date(post.published_at), "MMM d, yyyy")}</time>
          </>
        )}
      </div>
    </Link>
  );
}
