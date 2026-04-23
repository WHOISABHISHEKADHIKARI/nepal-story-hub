import { type ReactNode } from "react";
type User = any;
type Session = any;
export type AppRole = "admin" | "contributor";
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
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextValue;
export {};
