import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Inbox, Users, CheckCircle2 } from "lucide-react";
import { mcpApi } from "@/lib/api-mcp";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ posts: 0, pending: 0, contributors: 0, requests: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [pubRes, pendRes, authRes] = await Promise.all([
          mcpApi.listPosts(), // status published is likely default or we can't filter precisely yet
          mcpApi.listPosts(), // we'll filter in memory if needed
          mcpApi.listAuthors(),
        ]);
        
        const posts = pubRes.data || [];
        const authors = authRes.data || [];
        
        setStats({
          posts: posts.filter(p => p.status === "published").length,
          pending: posts.filter(p => p.status === "draft").length, // Using draft as pending for now
          contributors: authors.length,
          requests: 0, // MCP doesn't have requests yet
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    })();
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display text-3xl">Overview</h1>
      <p className="text-muted-foreground mt-1">A snapshot of the publication.</p>

      <div className="grid gap-4 md:grid-cols-4 mt-8">
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
    <div className={`p-5 rounded-lg border ${accent && value > 0 ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"}`}>
      <Icon className={`h-5 w-5 ${accent && value > 0 ? "text-primary" : "text-muted-foreground"}`} />
      <div className="font-display text-3xl mt-2">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
