import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const SUPER_ADMIN_EMAILS = new Set(["abhishekadikari1254@gmail.com"]
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean));
const AuthContext = createContext(undefined);
function normalizeRoles(user) {
    if (!user)
        return [];
    const candidates = [
        user.app_metadata?.roles,
        user.user_metadata?.roles,
        user.app_metadata?.role,
        user.user_metadata?.role,
    ].flatMap((value) => Array.isArray(value) ? value : value ? [value] : []);
    const normalized = candidates
        .map((value) => String(value).toLowerCase())
        .filter((value) => value === "admin" || value === "contributor");
    if (SUPER_ADMIN_EMAILS.has(String(user.email ?? "").trim().toLowerCase())) {
        normalized.push("admin");
    }
    return Array.from(new Set(normalized));
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const boot = async () => {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setRoles(normalizeRoles(initialSession?.user ?? null));
            setLoading(false);
        };
        void boot();
        const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setRoles(normalizeRoles(newSession?.user ?? null));
            setLoading(false);
        });
        return () => {
            if (sub && typeof sub.unsubscribe === "function") {
                sub.unsubscribe();
            }
        };
    }, []);
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setRoles([]);
            toast.success("Signed out successfully");
        }
        catch (error) {
            toast.error(error.message || "Failed to sign out");
        }
    };
    const refreshRoles = async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setRoles(normalizeRoles(currentSession?.user ?? null));
    };
    const value = {
        user,
        session,
        roles,
        loading,
        isAdmin: roles.includes("admin"),
        isContributor: !!user,
        signOut,
        refreshRoles,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
