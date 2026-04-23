import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { mcpApi } from "@/lib/api-mcp";
export const Route = createFileRoute("/admin/contributors")({
    component: AdminContributors,
});
function AdminContributors() {
    const [requests, setRequests] = useState([]);
    const [contributors, setContributors] = useState([]);
    const load = useCallback(async () => {
        try {
            const res = await mcpApi.listAuthors();
            setContributors(res.data || []);
            setRequests([]);
        }
        catch (err) {
            console.error("Failed to load authors:", err);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    const removeRole = async (slug) => {
        if (!confirm("Delete this author profile?"))
            return;
        try {
            const res = await mcpApi.deleteAuthor(slug);
            if (res.success) {
                toast.success("Removed");
                void load();
            }
            else {
                toast.error("Failed to remove author");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    };
    return (_jsxs("div", { className: "app-page space-y-8", children: [_jsxs("section", { children: [_jsx("span", { className: "section-kicker", children: "Contributor pipeline" }), _jsx("h1", { className: "mt-3 font-display text-3xl md:text-5xl", children: "Requests and writer profiles" })] }), _jsxs("section", { className: "app-panel p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "font-display text-2xl", children: "Contributor requests" }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Pending applications will appear here once the API supports them." })] }), requests.filter((r) => r.status === "pending").length === 0 && (_jsx("p", { className: "font-serif italic text-muted-foreground", children: "No pending requests." }))] }), _jsxs("section", { className: "app-panel overflow-hidden", children: [_jsx("div", { className: "border-b border-border/60 px-6 py-5", children: _jsx("h2", { className: "font-display text-2xl", children: "Existing authors" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "data-table min-w-[680px]", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Slug" }), _jsx("th", { className: "text-right", children: "Action" })] }) }), _jsx("tbody", { children: contributors.map((c) => (_jsxs("tr", { children: [_jsx("td", { className: "font-medium text-foreground", children: c.name }), _jsx("td", { className: "text-muted-foreground", children: c.slug }), _jsx("td", { children: _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => removeRole(c.slug), className: "text-sm text-destructive hover:underline", children: "Remove" }) }) })] }, c.id))) })] }) })] })] }));
}
