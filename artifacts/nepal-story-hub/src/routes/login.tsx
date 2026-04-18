import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
  displayName: z.string().trim().min(2).max(60).optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s) => ({ redirect: (s.redirect as string) || "/" }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: search.redirect });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${search.redirect !== "/" ? search.redirect : ""}`,
      },
    });
    if (error) {
      toast.error(error.message ?? "Google sign-in failed");
      setBusy(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, displayName: displayName || undefined });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      navigate({ to: search.redirect });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md px-5 py-16">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{mode === "signin" ? "Welcome back" : "Join Hamro Katha"}</span>
        <h1 className="font-display text-4xl mt-2">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-serif">
          {mode === "signin"
            ? "Writers, editors, and the curious — welcome."
            : "Create an account and start writing immediately."}
        </p>

        <div className="mt-8 space-y-3">
          <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={busy}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"/>
            </svg>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-card border border-border/60 rounded-lg p-6">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up →" : "Already have an account? Sign in →"}
        </button>
      </div>
    </PublicLayout>
  );
}
