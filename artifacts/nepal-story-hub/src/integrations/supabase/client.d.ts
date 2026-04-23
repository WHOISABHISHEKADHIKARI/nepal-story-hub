import type { Database } from './types';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", {
    Tables: {
        categories: {
            Row: {
                created_at: string;
                description: string | null;
                id: string;
                name: string;
                slug: string;
            };
            Insert: {
                created_at?: string;
                description?: string | null;
                id?: string;
                name: string;
                slug: string;
            };
            Update: {
                created_at?: string;
                description?: string | null;
                id?: string;
                name?: string;
                slug?: string;
            };
            Relationships: [];
        };
        contributor_requests: {
            Row: {
                bio: string;
                created_at: string;
                email: string;
                full_name: string;
                id: string;
                motivation: string;
                reviewer_notes: string | null;
                status: Database["public"]["Enums"]["request_status"];
                updated_at: string;
                user_id: string | null;
                writing_samples: string | null;
            };
            Insert: {
                bio: string;
                created_at?: string;
                email: string;
                full_name: string;
                id?: string;
                motivation: string;
                reviewer_notes?: string | null;
                status?: Database["public"]["Enums"]["request_status"];
                updated_at?: string;
                user_id?: string | null;
                writing_samples?: string | null;
            };
            Update: {
                bio?: string;
                created_at?: string;
                email?: string;
                full_name?: string;
                id?: string;
                motivation?: string;
                reviewer_notes?: string | null;
                status?: Database["public"]["Enums"]["request_status"];
                updated_at?: string;
                user_id?: string | null;
                writing_samples?: string | null;
            };
            Relationships: [];
        };
        posts: {
            Row: {
                author_id: string;
                category_id: string | null;
                content: string;
                cover_image_url: string | null;
                created_at: string;
                excerpt: string | null;
                featured: boolean;
                id: string;
                meta_description: string | null;
                meta_title: string | null;
                published_at: string | null;
                reviewer_notes: string | null;
                slug: string;
                status: Database["public"]["Enums"]["post_status"];
                tags: string[] | null;
                title: string;
                updated_at: string;
                view_count: number;
            };
            Insert: {
                author_id: string;
                category_id?: string | null;
                content: string;
                cover_image_url?: string | null;
                created_at?: string;
                excerpt?: string | null;
                featured?: boolean;
                id?: string;
                meta_description?: string | null;
                meta_title?: string | null;
                published_at?: string | null;
                reviewer_notes?: string | null;
                slug: string;
                status?: Database["public"]["Enums"]["post_status"];
                tags?: string[] | null;
                title: string;
                updated_at?: string;
                view_count?: number;
            };
            Update: {
                author_id?: string;
                category_id?: string | null;
                content?: string;
                cover_image_url?: string | null;
                created_at?: string;
                excerpt?: string | null;
                featured?: boolean;
                id?: string;
                meta_description?: string | null;
                meta_title?: string | null;
                published_at?: string | null;
                reviewer_notes?: string | null;
                slug?: string;
                status?: Database["public"]["Enums"]["post_status"];
                tags?: string[] | null;
                title?: string;
                updated_at?: string;
                view_count?: number;
            };
            Relationships: [{
                foreignKeyName: "posts_category_id_fkey";
                columns: ["category_id"];
                isOneToOne: false;
                referencedRelation: "categories";
                referencedColumns: ["id"];
            }];
        };
        profiles: {
            Row: {
                avatar_url: string | null;
                bio: string | null;
                created_at: string;
                display_name: string;
                id: string;
                updated_at: string;
                website: string | null;
            };
            Insert: {
                avatar_url?: string | null;
                bio?: string | null;
                created_at?: string;
                display_name: string;
                id: string;
                updated_at?: string;
                website?: string | null;
            };
            Update: {
                avatar_url?: string | null;
                bio?: string | null;
                created_at?: string;
                display_name?: string;
                id?: string;
                updated_at?: string;
                website?: string | null;
            };
            Relationships: [];
        };
        user_roles: {
            Row: {
                created_at: string;
                id: string;
                role: Database["public"]["Enums"]["app_role"];
                user_id: string;
            };
            Insert: {
                created_at?: string;
                id?: string;
                role: Database["public"]["Enums"]["app_role"];
                user_id: string;
            };
            Update: {
                created_at?: string;
                id?: string;
                role?: Database["public"]["Enums"]["app_role"];
                user_id?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: {
        has_role: {
            Args: {
                _role: Database["public"]["Enums"]["app_role"];
                _user_id: string;
            };
            Returns: boolean;
        };
    };
    Enums: {
        app_role: "admin" | "contributor";
        post_status: "draft" | "pending" | "published" | "rejected";
        request_status: "pending" | "approved" | "rejected";
    };
    CompositeTypes: { [_ in never]: never; };
}>;
