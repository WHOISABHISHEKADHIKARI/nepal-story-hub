import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type User = any;
type Session = any;

export type AppRole = "admin" | "contributor";
const SUPER_ADMIN_EMAILS = new Set(
  ["abhishekadikari1254@gmail.com"]
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isContributor: boolean;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeRoles(user: User | null): AppRole[] {
  if (!user) return [];

  const candidates = [
    user.app_metadata?.roles,
    user.user_metadata?.roles,
    user.app_metadata?.role,
    user.user_metadata?.role,
  ].flatMap((value: unknown) => Array.isArray(value) ? value : value ? [value] : []);

  const normalized = candidates
    .map((value) => String(value).toLowerCase())
    .filter((value): value is AppRole => value === "admin" || value === "contributor");

  if (SUPER_ADMIN_EMAILS.has(String(user.email ?? "").trim().toLowerCase())) {
    normalized.push("admin");
  }

  return Array.from(new Set(normalized));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      const { data: { session: initialSession } } = await (supabase.auth as any).getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setRoles(normalizeRoles(initialSession?.user ?? null));
      setLoading(false);
    };

    void boot();

    const { data: sub } = (supabase.auth as any).onAuthStateChange(async (_event: any, newSession: any) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setRoles(normalizeRoles(newSession?.user ?? null));
      setLoading(false);
    });

    return () => {
      if (sub && typeof (sub as any).unsubscribe === "function") {
        (sub as any).unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      await (supabase.auth as any).signOut();
      setRoles([]);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const refreshRoles = async () => {
    const { data: { session: currentSession } } = await (supabase.auth as any).getSession();
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setRoles(normalizeRoles(currentSession?.user ?? null));
  };

  const value: AuthContextValue = {
    user,
    session,
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    isContributor: !!user,
    signOut,
    refreshRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
