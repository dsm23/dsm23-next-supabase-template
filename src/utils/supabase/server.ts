import { cookies } from "next/headers";
import type { UnsafeUnwrappedCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const createClient = () => {
  const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
