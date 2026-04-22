import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";

interface Cat { id: string; name: string; slug: string; description: string | null; }

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await mcpApi.listCategories();
      const data = res.data || [];
      setCats(data.map((c) => ({ id: String(c.id), name: c.name, slug: c.slug, description: null })));
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async () => {
    if (!name.trim()) return;
    try {
      const res = await mcpApi.createCategory({ name: name.trim(), project_id: 46 });
      if (res.success) {
        setName("");
        setDesc("");
        toast.success("Added");
        void load();
      } else {
        toast.error("Failed to add category");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await mcpApi.deleteCategory(slug);
      if (res.success) {
        toast.success("Deleted");
        void load();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="app-page max-w-5xl">
      <div className="mb-8">
        <span className="section-kicker">Taxonomy</span>
        <h1 className="mt-3 font-display text-3xl md:text-5xl">Categories</h1>
      </div>

      <div className="app-panel mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>New category name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Climate" className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="field-shell mt-2 rounded-xl border-0 shadow-none" />
          </div>
        </div>
        <Button onClick={add} className="mt-4 rounded-full">Add category</Button>
      </div>

      <div className="app-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[640px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-foreground">{c.name}</td>
                  <td className="font-mono text-sm text-muted-foreground">{c.slug}</td>
                  <td>
                    <div className="flex justify-end">
                      <button onClick={() => remove(c.slug)} className="text-sm text-destructive hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
