import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Inbox, Users, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ posts: 0, pending: 0, contributors: 0, requests: 0 });

  useEffect(() => {
    (async () => {
      const [pub, pend, contribs, reqs] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "contributor"),
        supabase.from("contributor_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        posts: pub.count ?? 0,
        pending: pend.count ?? 0,
        contributors: contribs.count ?? 0,
        requests: reqs.count ?? 0,
      });
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
