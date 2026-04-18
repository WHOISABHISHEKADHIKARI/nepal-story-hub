import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

interface Cat { id: string; name: string; slug: string; description: string | null; }

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCats(data ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!name.trim()) return;
    const slug = slugify(name);
    const { error } = await supabase.from("categories").insert({ name: name.trim(), slug, description: desc || null });
    if (error) return toast.error(error.message);
    setName(""); setDesc("");
    toast.success("Added");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl mb-6">Categories</h1>

      <div className="bg-card border border-border/60 rounded-lg p-5 mb-6 space-y-3">
        <div>
          <Label>New category name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Climate" />
        </div>
        <div>
          <Label>Description (optional)</Label>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
        </div>
        <Button onClick={add}>Add category</Button>
      </div>

      <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-right p-3"></th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t border-border/60">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground font-mono text-xs">{c.slug}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove(c.id)} className="text-xs text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
