import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, PenLine, BookOpen, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { PostCard, type PostListItem } from "@/components/PostCard";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [featured, setFeatured] = useState<PostListItem[]>([]);
  const [recent, setRecent] = useState<PostListItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const postsRes = await mcpApi.listPosts();
        const postsData = postsRes.data || [];

        const mappedPosts: PostListItem[] = postsData.map((p) => ({
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
      } catch (err) {
        console.error("Failed to fetch recent posts:", err);
      }
    })();
  }, []);

  return (
    <PublicLayout>
      <section className="section-space relative overflow-hidden">
        <div className="page-shell relative masthead-grid">
          <div className="lead-story">
            <span className="section-kicker mb-5">A publication from Nepal</span>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.98] text-balance text-foreground md:text-7xl">
              Thoughtful stories for readers who prefer depth over travel noise.
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-lg leading-8 text-muted-foreground md:text-xl">
              Hamro Katha publishes reported essays, dispatches, and travel writing from Nepal with the restraint, pacing, and curiosity of a strong magazine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/blog">
                <Button size="lg" className="gap-2 rounded-full px-6 shadow-sm">
                  Start reading <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/become-contributor">
                <Button size="lg" variant="outline" className="gap-2 rounded-full bg-white/50 px-6">
                  <PenLine className="h-4 w-4" /> Become a contributor
                </Button>
              </Link>
            </div>
          </div>

          <aside className="side-ledger">
            <span className="section-kicker mb-5">Why readers stay</span>
            <div className="space-y-5">
              <Stat icon={<BookOpen className="h-5 w-5" />} label="Longform pacing" value="Deep reads" />
              <Stat icon={<Users className="h-5 w-5" />} label="Local voices" value="Grounded reporting" />
            </div>
            {recent[0] && (
              <div className="mt-8 border-t border-border/60 pt-5">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary">From the latest issue</div>
                <div className="mini-story-list mt-4">
                  {recent.slice(0, 2).map((story) => (
                    <Link key={story.id} to="/blog/$slug" params={{ slug: story.slug }} className="mini-story-link">
                      <div className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {story.categories?.name ?? "Story"}
                      </div>
                      <div className="mt-2 font-display text-2xl leading-tight text-foreground">{story.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-space pt-0">
          <div className="page-shell">
            <div className="section-header">
              <div>
                <span className="section-kicker">Editor&apos;s picks</span>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">Featured stories</h2>
              </div>
              <Link to="/blog" className="section-link">
                See the full archive
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((p) => (
                <PostCard key={p.id} post={p} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-space pt-0">
        <div className="page-shell">
          <div className="section-header">
            <div>
              <span className="section-kicker">Fresh from the desk</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Recent stories</h2>
            </div>
            <Link to="/blog" className="section-link">
              Browse all
            </Link>
          </div>
          {recent.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2">
              {recent.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div className="editorial-panel rounded-[1.5rem] px-6 py-12 text-center md:px-10">
              <p className="font-serif italic text-muted-foreground">
                No stories published yet. Sign in as the admin to create the first one,
                or invite contributors.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell">
          <div className="split-callout">
            <div>
              <span className="section-kicker">Join the publication</span>
              <h2 className="mt-3 font-display text-3xl text-balance md:text-5xl">
                Have a story Nepal needs to hear?
              </h2>
              <p className="mt-4 font-serif text-lg leading-8 text-muted-foreground">
                We are building a home for honest, well-told stories about Nepal. If you
                write, apply to join. Every voice strengthens the chorus.
              </p>
              <Link to="/become-contributor" className="mt-7 inline-block">
                <Button size="lg" className="rounded-full px-6">Apply to write</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Stat icon={<BookOpen className="h-5 w-5" />} label="Published stories" value="Growing" />
              <Stat icon={<Users className="h-5 w-5" />} label="Contributors" value="Welcoming" />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border/60 bg-white/65 p-5 backdrop-blur-sm">
      <div className="mb-3 text-primary">{icon}</div>
      <div className="font-display text-2xl leading-tight">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
    </div>
  );
}
