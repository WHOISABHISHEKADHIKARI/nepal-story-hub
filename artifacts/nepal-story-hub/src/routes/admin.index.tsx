import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Inbox, Users, CheckCircle2, Compass, Newspaper } from "lucide-react";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ posts: 0, pending: 0, contributors: 0, requests: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [pubRes, authRes] = await Promise.all([
          mcpApi.listPosts(),
          mcpApi.listAuthors(),
        ]);

        const posts = pubRes.data || [];
        const authors = authRes.data || [];

        setStats({
          posts: posts.filter((p) => p.status === "published").length,
          pending: posts.filter((p) => p.status === "draft").length,
          contributors: authors.length,
          requests: 0,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    })();
  }, []);

  return (
    <div className="app-page">
      <section className="workspace-hero px-6 py-8 md:px-8 md:py-9">
        <span className="section-kicker">Admin overview</span>
        <div className="mt-3 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_20rem]">
          <div>
            <h1 className="font-display text-3xl md:text-5xl">Publication snapshot with the right amount of urgency.</h1>
            <p className="mt-3 max-w-2xl font-serif text-lg leading-8 text-muted-foreground">
              This view should tell an editor what needs attention in under ten seconds: what is live, what is waiting, and where the next bottleneck is forming.
            </p>
          </div>
          <div className="workspace-note">
            <div className="flex items-center gap-2 text-primary"><Compass className="h-4 w-4" /> Editorial direction</div>
            <div className="mt-3 font-display text-2xl leading-tight text-foreground">
              {stats.pending > 0 ? "Review queue needs attention" : "Desk is clear"}
            </div>
            <div className="mt-2 text-sm leading-7">
              {stats.pending > 0 ? `${stats.pending} drafts are waiting for a decision.` : "No draft backlog right now, so you can focus on quality and cadence."}
            </div>
          </div>
        </div>
        <div className="workspace-metrics mt-6">
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><CheckCircle2 className="h-4 w-4" /> Published</div>
            <div className="workspace-metric-value mt-3">{stats.posts}</div>
            <div className="workspace-metric-label">Stories currently live</div>
          </div>
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><Inbox className="h-4 w-4" /> Pending</div>
            <div className="workspace-metric-value mt-3">{stats.pending}</div>
            <div className="workspace-metric-label">Drafts to review</div>
          </div>
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><Newspaper className="h-4 w-4" /> Requests</div>
            <div className="workspace-metric-value mt-3">{stats.requests}</div>
            <div className="workspace-metric-label">Open contributor requests</div>
          </div>
          <div className="workspace-metric">
            <div className="flex items-center gap-2 text-primary"><Users className="h-4 w-4" /> Contributors</div>
            <div className="workspace-metric-value mt-3">{stats.contributors}</div>
            <div className="workspace-metric-label">Writers on the roster</div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CheckCircle2} label="Published" value={stats.posts} />
        <Stat icon={Inbox} label="Pending review" value={stats.pending} accent />
        <Stat icon={FileText} label="Open requests" value={stats.requests} accent />
        <Stat icon={Users} label="Contributors" value={stats.contributors} />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof FileText; label: string; value: number; accent?: boolean }) {
  return (
    <div className={`admin-stat ${accent && value > 0 ? "border-primary/30 bg-primary/5" : ""}`}>
      <Icon className={`h-5 w-5 ${accent && value > 0 ? "text-primary" : "text-muted-foreground"}`} />
      <div className="mt-3 font-display text-4xl leading-none">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
    </div>
  );
}
