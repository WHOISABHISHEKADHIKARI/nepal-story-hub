import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
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
      setRequests([]);
    } catch (err) {
      console.error("Failed to load authors:", err);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const removeRole = async (slug: string) => {
    if (!confirm("Delete this author profile?")) return;
    try {
      const res = await mcpApi.deleteAuthor(slug);
      if (res.success) {
        toast.success("Removed");
        void load();
      } else {
        toast.error("Failed to remove author");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="app-page space-y-8">
      <section>
        <span className="section-kicker">Contributor pipeline</span>
        <h1 className="mt-3 font-display text-3xl md:text-5xl">Requests and writer profiles</h1>
      </section>

      <section className="app-panel p-6">
        <div className="mb-4">
          <h2 className="font-display text-2xl">Contributor requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pending applications will appear here once the API supports them.</p>
        </div>
        {requests.filter((r) => r.status === "pending").length === 0 && (
          <p className="font-serif italic text-muted-foreground">No pending requests.</p>
        )}
      </section>

      <section className="app-panel overflow-hidden">
        <div className="border-b border-border/60 px-6 py-5">
          <h2 className="font-display text-2xl">Existing authors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table min-w-[680px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground">{c.name}</td>
                  <td className="text-muted-foreground">{c.slug}</td>
                  <td>
                    <div className="flex justify-end">
                      <button onClick={() => removeRole(c.slug)} className="text-sm text-destructive hover:underline">Remove</button>
                    </div>
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
