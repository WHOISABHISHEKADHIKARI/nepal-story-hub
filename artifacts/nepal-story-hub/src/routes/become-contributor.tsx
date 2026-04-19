import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        description: parsed.data.motivation
      });
      
      if (res.success) {
        setSubmitted(true);
      } else {
        toast.error("Failed to submit request");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
          <h1 className="font-display text-3xl mt-4">Thank you.</h1>
          <p className="mt-3 text-muted-foreground font-serif">
            We'll review your application and get back to you by email. In the meantime,
            read a few stories to get a feel for our voice.
          </p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Join us</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 leading-tight">Become a contributor</h1>
        <p className="mt-4 text-muted-foreground font-serif text-lg">
          Tell us who you are and what you'd like to write. We respond to every application.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5 bg-card border border-border/60 rounded-lg p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">A little about you</Label>
            <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required maxLength={2000} placeholder="Where you're from, what you do, what draws you to writing." />
          </div>
          <div>
            <Label htmlFor="mot">What would you like to write about?</Label>
            <Textarea id="mot" rows={4} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} required maxLength={2000} placeholder="A specific topic, beat, or ongoing series you have in mind." />
          </div>
          <div>
            <Label htmlFor="samples">Writing samples (optional)</Label>
            <Textarea id="samples" rows={3} value={form.writing_samples} onChange={(e) => setForm({ ...form, writing_samples: e.target.value })} maxLength={5000} placeholder="Links to published work or a short excerpt." />
          </div>
          <Button type="submit" disabled={busy} size="lg" className="w-full">
            {busy ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
}
