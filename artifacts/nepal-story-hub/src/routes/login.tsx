import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/integrations/supabase/config";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
  displayName: z.string().trim().min(2).max(60).optional(),
});

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch("/"),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => loginSearchSchema.parse(s),
  beforeLoad: async ({ search }: { search: { redirect?: string } }) => {
    const { data } = await (supabase.auth as any).getSession();
    if (data.session) throw redirect({ to: search.redirect || "/" });
  },
  component: LoginPage,
});

function LoginPage() {
  const supabaseHost = new URL(SUPABASE_URL).host;
  const supabaseProjectRef = supabaseHost.split(".")[0];
  const navigate = useNavigate();
  const search = Route.useSearch() as { redirect?: string };
  const redirectPath =
    typeof search.redirect === "string" && search.redirect.startsWith("/")
      ? search.redirect
      : "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [providerLoading, setProviderLoading] = useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const loadAuthSettings = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
          },
        });
        if (!res.ok) throw new Error("Failed to load auth settings");
        const settings = await res.json();
        if (!cancelled) {
          setGoogleEnabled(Boolean(settings?.external?.google));
        }
      } catch {
        if (!cancelled) {
          setGoogleEnabled(false);
        }
      } finally {
        if (!cancelled) {
          setProviderLoading(false);
        }
      }
    };

    void loadAuthSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleGoogle = async () => {
    if (!googleEnabled) {
      toast.error("Google sign-in is not enabled in this Supabase project yet.");
      return;
    }

    setBusy(true);
    const redirectTo = new URL(redirectPath, window.location.origin).toString();
    const { error } = await (supabase.auth as any).signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
    if (error) {
      toast.error(error.message ?? "Google sign-in failed");
      setBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, displayName: displayName || undefined });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await (supabase.auth as any).signUp({
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
        const { error } = await (supabase.auth as any).signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      navigate({ to: search.redirect || "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PublicLayout>
      <div className="page-shell section-space max-w-5xl">
        <div className="auth-layout-grid">
          <section className="auth-showcase px-6 py-10 md:px-10 md:py-12">
            <span className="section-kicker">{mode === "signin" ? "Welcome back" : "Join Hamro Katha"}</span>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
              {mode === "signin" ? "Sign in to the newsroom." : "Create your writing account."}
            </h1>
            <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground">
              {mode === "signin"
                ? "Writers, editors, and curious readers can pick up where they left off."
                : "Create an account, pitch stories, and move from draft to publication with a cleaner editorial workflow."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="auth-chip"><span className="auth-orb" /> Supabase auth</span>
              <span className="auth-chip"><span className="auth-orb" /> Blog MCP CMS</span>
            </div>
            <div className="auth-split-cards mt-8">
              <div className="auth-info-card">
                <div className="auth-info-label">Authentication</div>
                <div className="auth-info-title">Supabase handles identity</div>
                <p className="auth-info-copy">
                  Sign in, sign up, session refresh, password auth, and Google OAuth stay on the Supabase side.
                </p>
              </div>
              <div className="auth-info-card">
                <div className="auth-info-label">Content system</div>
                <div className="auth-info-title">Publishing stays in MCP</div>
                <p className="auth-info-copy">
                  Posts, categories, contributors, and editorial workflow remain with the blog API service.
                </p>
              </div>
            </div>
            <div className="auth-boundary-panel mt-4">
              <div className="auth-boundary-header">
                <div>
                  <div className="auth-info-label">Auth boundary</div>
                  <div className="auth-info-title">Supabase only handles authentication</div>
                </div>
                <div className="auth-host-stack">
                  <span className="auth-host-pill">{supabaseProjectRef}</span>
                  <span className="auth-host-pill">{supabaseHost}</span>
                </div>
              </div>
              <div className="auth-boundary-grid">
                <div className="auth-boundary-item">
                  <div className="auth-boundary-title">Supabase owns</div>
                  <p>Email/password, enabled OAuth providers, session persistence, redirect flow, and auth state changes.</p>
                </div>
                <div className="auth-boundary-item">
                  <div className="auth-boundary-title">Role claims</div>
                  <p>Admin and contributor access is read from auth metadata claims, not from a CMS table.</p>
                </div>
                <div className="auth-boundary-item">
                  <div className="auth-boundary-title">MCP owns</div>
                  <p>Posts, categories, contributor records, publishing workflow, and editorial content data.</p>
                </div>
                <div className="auth-boundary-item">
                  <div className="auth-boundary-title">Important rule</div>
                  <p>No CMS content is stored in Supabase tables for this app surface.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="app-panel p-6 md:p-8">
            <div className="auth-form-rail">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="auth-mode-toggle"
                data-active={mode === "signin"}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="auth-mode-toggle"
                data-active={mode === "signup"}
              >
                Create account
              </button>
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 rounded-full bg-white/55"
                onClick={handleGoogle}
                disabled={busy || providerLoading || !googleEnabled}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"/>
                </svg>
                {providerLoading
                  ? "Checking Google sign-in"
                  : googleEnabled
                    ? "Continue with Google"
                    : "Google sign-in unavailable"}
              </Button>
              {!providerLoading && !googleEnabled && (
                <div className="rounded-[1rem] border border-border/60 bg-white/45 px-4 py-3 text-sm leading-7 text-muted-foreground">
                  Google OAuth is disabled in this Supabase project right now. Use email and password, or enable Google in the Supabase Auth providers panel.
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">or with email</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Display name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="field-shell mt-2 h-12 rounded-xl border-0 shadow-none" />
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={busy}>
                {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 rounded-[1.2rem] border border-border/60 bg-white/45 px-4 py-4 text-sm leading-7 text-muted-foreground">
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">Connected auth service</div>
              <div className="mt-2 font-medium text-foreground">{supabaseHost}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Google provider: {providerLoading ? "checking" : googleEnabled ? "enabled" : "disabled"}
              </div>
              <p className="mt-2">
                {mode === "signin"
                  ? "Use the same Supabase session for admin and contributor tools after sign-in."
                  : "New accounts are created in Supabase first, then the editorial app reads auth claims for access."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
