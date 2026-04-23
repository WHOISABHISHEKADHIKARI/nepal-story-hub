import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/admin/categories")({
    component: AdminCategories,
});
function AdminCategories() {
    const [cats, setCats] = useState([]);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const load = useCallback(async () => {
        try {
            const res = await mcpApi.listCategories();
            const data = res.data || [];
            setCats(data.map((c) => ({ id: String(c.id), name: c.name, slug: c.slug, description: null })));
        }
        catch (err) {
            console.error("Failed to load categories:", err);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    const add = async () => {
        if (!name.trim())
            return;
        try {
            const res = await mcpApi.createCategory({ name: name.trim(), project_id: 46 });
            if (res.success) {
                setName("");
                setDesc("");
                toast.success("Added");
                void load();
            }
            else {
                toast.error("Failed to add category");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    const remove = async (slug) => {
        if (!confirm("Delete this category?"))
            return;
        try {
            const res = await mcpApi.deleteCategory(slug);
            if (res.success) {
                toast.success("Deleted");
                void load();
            }
            else {
                toast.error("Failed to delete category");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    return (_jsxs("div", { className: "app-page max-w-5xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("span", { className: "section-kicker", children: "Taxonomy" }), _jsx("h1", { className: "mt-3 font-display text-3xl md:text-5xl", children: "Categories" })] }), _jsxs("div", { className: "app-panel mb-6 p-6", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { children: "New category name" }), _jsx(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Climate", className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Description (optional)" }), _jsx(Textarea, { value: desc, onChange: (e) => setDesc(e.target.value), rows: 2, className: "field-shell mt-2 rounded-xl border-0 shadow-none" })] })] }), _jsx(Button, { onClick: add, className: "mt-4 rounded-full", children: "Add category" })] }), _jsx("div", { className: "app-panel overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "data-table min-w-[640px]", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Slug" }), _jsx("th", { className: "text-right", children: "Action" })] }) }), _jsx("tbody", { children: cats.map((c) => (_jsxs("tr", { children: [_jsx("td", { className: "font-medium text-foreground", children: c.name }), _jsx("td", { className: "font-mono text-sm text-muted-foreground", children: c.slug }), _jsx("td", { children: _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => remove(c.slug), className: "text-sm text-destructive hover:underline", children: "Delete" }) }) })] }, c.id))) })] }) }) })] }));
}
