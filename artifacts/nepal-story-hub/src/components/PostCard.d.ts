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
    categories?: {
        name: string;
        slug: string;
    } | null;
    profiles?: {
        display_name: string;
    } | null;
}
export declare function PostCard({ post, variant, }: {
    post: PostListItem;
    variant?: "default" | "featured" | "compact";
}): import("react/jsx-runtime").JSX.Element;
