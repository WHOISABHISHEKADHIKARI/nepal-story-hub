import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface Contributor {
  user_id: string;
  role: string;
  profiles?: { display_name: string } | null;
}

export const Route = createFileRoute("/admin/contributors")({
  component: AdminContributors,
});

function AdminContributors() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const load = useCallback(async () => {
    const [reqs, roles] = await Promise.all([
      supabase.from("contributor_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role, profiles(display_name)").order("created_at", { ascending: false }),
    ]);
    setRequests((reqs.data ?? []) as Request[]);
    setContributors((roles.data ?? []) as unknown as Contributor[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (req: Request) => {
    if (!req.user_id) {
      toast.error("This applicant hasn't created an account yet. Ask them to sign up first.");
      return;
    }
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: req.user_id, role: "contributor" });
    if (roleErr && !roleErr.message.includes("duplicate")) return toast.error(roleErr.message);
    await supabase.from("contributor_requests").update({ status: "approved" }).eq("id", req.id);
    toast.success("Approved");
    load();
  };

  const reject = async (id: string) => {
    await supabase.from("contributor_requests").update({ status: "rejected" }).eq("id", id);
    toast.success("Rejected");
    load();
  };

  const removeRole = async (userId: string, role: string) => {
    if (!confirm(`Remove ${role} role?`)) return;
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "contributor");
    toast.success("Removed");
    load();
  };

  const promote = async (userId: string) => {
    if (!confirm("Promote this user to admin?")) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error && !error.message.includes("duplicate")) return toast.error(error.message);
    toast.success("Promoted to admin");
    load();
  };

  return (
    <div className="p-8 max-w-5xl space-y-10">
      <section>
        <h1 className="font-display text-3xl mb-1">Contributor requests</h1>
        <p className="text-muted-foreground text-sm mb-5">Pending applications to write for Hamro Katha.</p>
        <div className="space-y-3">
          {requests.filter(r => r.status === "pending").length === 0 && (
            <p className="text-sm text-muted-foreground italic">No pending requests.</p>
          )}
          {requests.filter(r => r.status === "pending").map((r) => (
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
        <h2 className="font-display text-2xl mb-4">Active contributors & admins</h2>
        <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Role</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((c) => (
                <tr key={c.user_id + c.role} className="border-t border-border/60">
                  <td className="p-3">{c.profiles?.display_name ?? c.user_id.slice(0, 8)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${c.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {c.role === "contributor" && (
                      <button onClick={() => promote(c.user_id)} className="text-xs text-primary hover:underline">Promote to admin</button>
                    )}
                    <button onClick={() => removeRole(c.user_id, c.role)} className="text-xs text-destructive hover:underline">Remove</button>
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
