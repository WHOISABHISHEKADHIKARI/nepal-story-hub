import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mcpApi, type MCPAuthor } from "@/lib/api-mcp";

interface Request {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  motivation: string;
  writing_samples: string | null;
  status: string;
  user_id: string | null;
  created_at: string;
}

export const Route = createFileRoute("/admin/contributors")({
  component: AdminContributors,
});

function AdminContributors() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [contributors, setContributors] = useState<MCPAuthor[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await mcpApi.listAuthors();
      setContributors(res.data || []);
      // Requests are not supported in MCP yet, keeping them empty
      setRequests([]);
    } catch (err) {
      console.error("Failed to load authors:", err);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (_req: Request) => {
    toast.error("Approval system is not implemented in MCP yet.");
  };

  const reject = async (_id: string) => {
    toast.error("Rejection system is not implemented in MCP yet.");
  };

  const removeRole = async (slug: string) => {
    if (!confirm(`Delete this author profile?`)) return;
    try {
      const res = await mcpApi.deleteAuthor(slug);
      if (res.success) {
        toast.success("Removed");
        load();
      } else {
        toast.error("Failed to remove author");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-8 max-w-5xl space-y-10">
      <section>
        <h1 className="font-display text-3xl mb-1">Contributor requests</h1>
        <p className="text-muted-foreground text-sm mb-5">Pending applications to write for Hamro Katha.</p>
        <div className="space-y-3">
          {requests.filter((r: any) => r.status === "pending").length === 0 && (
            <p className="text-sm text-muted-foreground italic">No pending requests.</p>
          )}
          {requests.filter((r: any) => r.status === "pending").map((r: any) => (
            <div key={r.id} className="bg-card border border-border/60 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display text-lg">{r.full_name}</div>
                  <div className="text-xs text-muted-foreground">{r.email} · {format(new Date(r.created_at), "MMM d, yyyy")}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approve(r)}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => reject(r.id)}>Reject</Button>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="font-medium mt-2">Bio</div>
                <p className="text-muted-foreground">{r.bio}</p>
                <div className="font-medium mt-2">What they want to write</div>
                <p className="text-muted-foreground">{r.motivation}</p>
                {r.writing_samples && (
                  <>
                    <div className="font-medium mt-2">Samples</div>
                    <p className="text-muted-foreground whitespace-pre-wrap break-words">{r.writing_samples}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-5">Existing authors</h2>
        <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((c) => (
                <tr key={c.id} className="border-t border-border/60">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.slug}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => removeRole(c.slug)} className="text-xs text-destructive hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
