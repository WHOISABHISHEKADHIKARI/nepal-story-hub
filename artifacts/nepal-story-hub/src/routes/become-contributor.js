import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { mcpApi } from "@/lib/api-mcp";
const schema = z.object({
    full_name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    bio: z.string().trim().min(20, "At least 20 characters").max(2000),
    motivation: z.string().trim().min(20, "At least 20 characters").max(2000),
    writing_samples: z.string().trim().max(5000).optional().or(z.literal("")),
});
export const Route = createFileRoute("/become-contributor")({
    component: BecomeContributor,
});
function BecomeContributor() {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        email: user?.email ?? "",
        bio: "",
        motivation: "",
        writing_samples: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsed = schema.safeParse(form);
        if (!parsed.success) {
            toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
            return;
        }
        setBusy(true);
        try {
            const res = await mcpApi.createAuthor({
                project_id: 46,
                name: parsed.data.full_name,
                bio: parsed.data.bio,
                description: parsed.data.motivation,
            });
            if (res.success) {
                setSubmitted(true);
            }
            else {
                toast.error("Failed to submit request");
            }
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    if (submitted) {
        return (_jsx(PublicLayout, { children: _jsxs("div", { className: "mx-auto max-w-lg px-5 py-24 text-center", children: [_jsx(CheckCircle2, { className: "mx-auto h-12 w-12 text-primary" }), _jsx("h1", { className: "mt-4 font-display text-3xl", children: "Thank you." }), _jsx("p", { className: "mt-3 font-serif text-muted-foreground", children: "We'll review your application and get back to you by email. In the meantime, read a few stories to get a feel for our voice." })] }) }));
    }
    return (_jsx(PublicLayout, { children: _jsxs("div", { className: "page-shell section-space max-w-4xl", children: [_jsx("span", { className: "section-kicker", children: "Join us" }), _jsx("h1", { className: "mt-3 font-display text-4xl leading-tight md:text-6xl", children: "Become a contributor" }), _jsx("p", { className: "mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground", children: "Tell us who you are and what you'd like to write. We respond to every application." }), _jsxs("form", { onSubmit: handleSubmit, className: "editorial-panel mt-10 space-y-5 rounded-[2rem] p-6 md:p-8", children: [_jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Full name" }), _jsx(Input, { id: "name", value: form.full_name, onChange: (e) => setForm({ ...form, full_name: e.target.value }), required: true, maxLength: 100, className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), required: true, maxLength: 255, className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "bio", children: "A little about you" }), _jsx(Textarea, { id: "bio", rows: 4, value: form.bio, onChange: (e) => setForm({ ...form, bio: e.target.value }), required: true, maxLength: 2000, placeholder: "Where you're from, what you do, what draws you to writing.", className: "field-shell mt-2 min-h-32 rounded-[1.1rem] border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "mot", children: "What would you like to write about?" }), _jsx(Textarea, { id: "mot", rows: 4, value: form.motivation, onChange: (e) => setForm({ ...form, motivation: e.target.value }), required: true, maxLength: 2000, placeholder: "A specific topic, beat, or ongoing series you have in mind.", className: "field-shell mt-2 min-h-32 rounded-[1.1rem] border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "samples", children: "Writing samples (optional)" }), _jsx(Textarea, { id: "samples", rows: 3, value: form.writing_samples, onChange: (e) => setForm({ ...form, writing_samples: e.target.value }), maxLength: 5000, placeholder: "Links to published work or a short excerpt.", className: "field-shell mt-2 min-h-28 rounded-[1.1rem] border-0 shadow-none" })] }), _jsx(Button, { type: "submit", disabled: busy, size: "lg", className: "w-full rounded-full", children: busy ? "Submitting..." : "Submit application" })] })] }) }));
}
