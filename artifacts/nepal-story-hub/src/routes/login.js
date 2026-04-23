import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    validateSearch: (s) => loginSearchSchema.parse(s),
    beforeLoad: async ({ search }) => {
        const { data } = await supabase.auth.getSession();
        if (data.session)
            throw redirect({ to: search.redirect || "/" });
    },
    component: LoginPage,
});
function LoginPage() {
    const supabaseHost = new URL(SUPABASE_URL).host;
    const supabaseProjectRef = supabaseHost.split(".")[0];
    const navigate = useNavigate();
    const search = Route.useSearch();
    const redirectPath = typeof search.redirect === "string" && search.redirect.startsWith("/")
        ? search.redirect
        : "/";
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [busy, setBusy] = useState(false);
    const [googleEnabled, setGoogleEnabled] = useState(false);
    const [providerLoading, setProviderLoading] = useState(true);
    React.useEffect(() => {
        let cancelled = false;
        const exchangeOAuthCode = async () => {
            const currentUrl = new URL(window.location.href);
            const code = currentUrl.searchParams.get("code");
            if (!code)
                return;
            setBusy(true);
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (cancelled)
                return;
            if (error) {
                toast.error(error.message ?? "Google sign-in failed");
                setBusy(false);
                return;
            }
            // Remove OAuth query params before redirecting.
            currentUrl.searchParams.delete("code");
            currentUrl.searchParams.delete("state");
            window.history.replaceState({}, document.title, currentUrl.pathname + currentUrl.search);
            toast.success("Signed in with Google.");
            void navigate({ to: redirectPath });
        };
        void exchangeOAuthCode();
        return () => {
            cancelled = true;
        };
    }, [navigate, redirectPath]);
    React.useEffect(() => {
        let cancelled = false;
        const loadAuthSettings = async () => {
            try {
                const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
                    headers: {
                        apikey: SUPABASE_PUBLISHABLE_KEY,
                    },
                });
                if (!res.ok)
                    throw new Error("Failed to load auth settings");
                const settings = await res.json();
                if (!cancelled) {
                    setGoogleEnabled(Boolean(settings?.external?.google));
                }
            }
            catch {
                if (!cancelled) {
                    setGoogleEnabled(false);
                }
            }
            finally {
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
        const callbackUrl = new URL("/login", window.location.origin);
        callbackUrl.searchParams.set("redirect", redirectPath);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: callbackUrl.toString(),
            },
        });
        if (error) {
            toast.error(error.message ?? "Google sign-in failed");
            setBusy(false);
        }
    };
    const handleSubmit = async (e) => {
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
                if (error)
                    throw error;
                toast.success("Account created. Welcome.");
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error)
                    throw error;
                toast.success("Signed in.");
            }
            navigate({ to: search.redirect || "/" });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            toast.error(msg);
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsx(PublicLayout, { children: _jsx("div", { className: "page-shell section-space max-w-5xl", children: _jsxs("div", { className: "auth-layout-grid", children: [_jsxs("section", { className: "auth-showcase px-6 py-10 md:px-10 md:py-12", children: [_jsx("span", { className: "section-kicker", children: mode === "signin" ? "Welcome back" : "Join Hamro Katha" }), _jsx("h1", { className: "mt-3 font-display text-4xl leading-tight md:text-6xl", children: mode === "signin" ? "Sign in to the newsroom." : "Create your writing account." }), _jsx("p", { className: "mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground", children: mode === "signin"
                                    ? "Writers, editors, and curious readers can pick up where they left off."
                                    : "Create an account, pitch stories, and move from draft to publication with a cleaner editorial workflow." }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [_jsxs("span", { className: "auth-chip", children: [_jsx("span", { className: "auth-orb" }), " Supabase auth"] }), _jsxs("span", { className: "auth-chip", children: [_jsx("span", { className: "auth-orb" }), " Blog MCP CMS"] })] }), _jsxs("div", { className: "auth-split-cards mt-8", children: [_jsxs("div", { className: "auth-info-card", children: [_jsx("div", { className: "auth-info-label", children: "Authentication" }), _jsx("div", { className: "auth-info-title", children: "Supabase handles identity" }), _jsx("p", { className: "auth-info-copy", children: "Sign in, sign up, session refresh, password auth, and Google OAuth stay on the Supabase side." })] }), _jsxs("div", { className: "auth-info-card", children: [_jsx("div", { className: "auth-info-label", children: "Content system" }), _jsx("div", { className: "auth-info-title", children: "Publishing stays in MCP" }), _jsx("p", { className: "auth-info-copy", children: "Posts, categories, contributors, and editorial workflow remain with the blog API service." })] })] }), _jsxs("div", { className: "auth-boundary-panel mt-4", children: [_jsxs("div", { className: "auth-boundary-header", children: [_jsxs("div", { children: [_jsx("div", { className: "auth-info-label", children: "Auth boundary" }), _jsx("div", { className: "auth-info-title", children: "Supabase only handles authentication" })] }), _jsxs("div", { className: "auth-host-stack", children: [_jsx("span", { className: "auth-host-pill", children: supabaseProjectRef }), _jsx("span", { className: "auth-host-pill", children: supabaseHost })] })] }), _jsxs("div", { className: "auth-boundary-grid", children: [_jsxs("div", { className: "auth-boundary-item", children: [_jsx("div", { className: "auth-boundary-title", children: "Supabase owns" }), _jsx("p", { children: "Email/password, enabled OAuth providers, session persistence, redirect flow, and auth state changes." })] }), _jsxs("div", { className: "auth-boundary-item", children: [_jsx("div", { className: "auth-boundary-title", children: "Role claims" }), _jsx("p", { children: "Admin and contributor access is read from auth metadata claims, not from a CMS table." })] }), _jsxs("div", { className: "auth-boundary-item", children: [_jsx("div", { className: "auth-boundary-title", children: "MCP owns" }), _jsx("p", { children: "Posts, categories, contributor records, publishing workflow, and editorial content data." })] }), _jsxs("div", { className: "auth-boundary-item", children: [_jsx("div", { className: "auth-boundary-title", children: "Important rule" }), _jsx("p", { children: "No CMS content is stored in Supabase tables for this app surface." })] })] })] })] }), _jsxs("section", { className: "app-panel p-6 md:p-8", children: [_jsxs("div", { className: "auth-form-rail", children: [_jsx("button", { type: "button", onClick: () => setMode("signin"), className: "auth-mode-toggle", "data-active": mode === "signin", children: "Sign in" }), _jsx("button", { type: "button", onClick: () => setMode("signup"), className: "auth-mode-toggle", "data-active": mode === "signup", children: "Create account" })] }), _jsxs("div", { className: "space-y-3", children: [(providerLoading || googleEnabled) && (_jsxs(Button, { type: "button", variant: "outline", className: "w-full gap-2 rounded-full bg-white/55", onClick: handleGoogle, disabled: busy || providerLoading, children: [_jsx("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", "aria-hidden": true, children: _jsx("path", { fill: "#EA4335", d: "M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" }) }), providerLoading ? "Checking Google sign-in" : "Continue with Google"] })), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-px flex-1 bg-border" }), _jsx("span", { className: "text-xs uppercase tracking-[0.16em] text-muted-foreground", children: googleEnabled ? "or with email" : "continue with email" }), _jsx("div", { className: "h-px flex-1 bg-border" })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-5 space-y-4", children: [mode === "signup" && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Display name" }), _jsx(Input, { id: "name", value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "Your name", className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] })), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "pw", children: "Password" }), _jsx(Input, { id: "pw", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 8, className: "field-shell mt-2 h-12 rounded-xl border-0 shadow-none" })] }), _jsx(Button, { type: "submit", className: "w-full rounded-full", disabled: busy, children: busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account" })] }), _jsxs("div", { className: "mt-6 rounded-[1.2rem] border border-border/60 bg-white/45 px-4 py-4 text-sm leading-7 text-muted-foreground", children: [_jsx("div", { className: "text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground", children: "Connected auth service" }), _jsx("div", { className: "mt-2 font-medium text-foreground", children: supabaseHost }), _jsxs("div", { className: "mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground", children: ["Google provider: ", providerLoading ? "checking" : googleEnabled ? "enabled" : "disabled"] }), _jsx("p", { className: "mt-2", children: mode === "signin"
                                            ? "Use the same Supabase session for admin and contributor tools after sign-in."
                                            : "New accounts are created in Supabase first, then the editorial app reads auth claims for access." })] })] })] }) }) }));
}
