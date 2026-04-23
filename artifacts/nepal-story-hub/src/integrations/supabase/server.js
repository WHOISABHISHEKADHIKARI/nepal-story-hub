import { createServerClient, parseCookieHeader, serializeCookieHeader, } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";
export function createSupabaseServerClient(request) {
    const headers = new Headers();
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
            getAll() {
                return parseCookieHeader(request.headers.get("Cookie") ?? "");
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
                });
            },
        },
    });
    return { supabase, headers };
}
