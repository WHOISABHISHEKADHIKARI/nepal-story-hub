import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, PenLine, BookOpen, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PostCard, type PostListItem } from "@/components/PostCard";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [featured, setFeatured] = useState<PostListItem[]>([]);
  const [recent, setRecent] = useState<PostListItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_image_url, published_at, featured, category_id, author_id, categories(name, slug), profiles(display_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(7);
      const posts = (data ?? []) as unknown as PostListItem[];
      setFeatured(posts.filter((p) => p.featured).slice(0, 3));
      setRecent(posts.filter((p) => !p.featured).slice(0, 4));
    })();
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background">
        <div className="relative mx-auto max-w-5xl px-5 pt-20 pb-28 md:pt-32 md:pb-36">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-5">
            A publication from Nepal
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-balance text-foreground max-w-3xl">
            The stories that shape{" "}
            <em className="text-primary not-italic font-display">our home.</em>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl font-serif leading-relaxed">
            From mountain villages to Kathmandu's alleys — independent journalism,
            travel writing, and cultural essays by Nepali voices and friends of Nepal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/blog">
              <Button size="lg" className="gap-2">
                Read latest stories <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/become-contributor">
              <Button size="lg" variant="outline" className="gap-2">
                <PenLine className="h-4 w-4" /> Become a contributor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 mt-2">
          <div className="bg-card border border-border/60 rounded-lg p-6 md:p-10 shadow-sm">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-2xl md:text-3xl">Featured</h2>
              <Link to="/blog" className="text-sm text-primary hover:underline">
                All stories →
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featured.map((p) => (
                <PostCard key={p.id} post={p} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent */}
      <section className="mx-auto max-w-6xl px-5 mt-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl">Recent stories</h2>
          <Link to="/blog" className="text-sm text-primary hover:underline">
            Browse all →
          </Link>
        </div>
        {recent.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2">
            {recent.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground font-serif italic">
              No stories published yet. Sign in as the admin to create the first one,
              or invite contributors.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 mt-24">
        <div className="rounded-xl bg-paper border border-border/60 px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-balance">
              Have a story Nepal needs to hear?
            </h2>
            <p className="mt-4 text-muted-foreground font-serif text-lg leading-relaxed">
              We're building a home for honest, well-told stories about Nepal. If you
              write — apply to join. Every voice strengthens the chorus.
            </p>
            <Link to="/become-contributor" className="inline-block mt-6">
              <Button size="lg">Apply to write</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Stat icon={<BookOpen className="h-5 w-5" />} label="Published stories" value="Growing" />
            <Stat icon={<Users className="h-5 w-5" />} label="Contributors" value="Welcoming" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg border border-border/60 p-5">
      <div className="text-primary mb-2">{icon}</div>
      <div className="font-display text-2xl">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
