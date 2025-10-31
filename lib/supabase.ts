import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'; // Only available in App Router server components/routes

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Only use if absolutely necessary and with extreme caution
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceRoleKey)) {
  throw new Error('Supabase URL and Anon/Service Role Key are required!');
}

// Client for authenticated users within server components/routes
// This function needs to be called in your API routes
export function createSupabaseAuthClient(jwt?: string) {
  // If a JWT is provided, use it for authentication
  if (jwt) {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      global: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
      auth: {
        persistSession: false, // Don't persist session in API routes
      }
    });
  }
  // Fallback for anonymous access (e.g., if you need public read access)
  return createClient(supabaseUrl!, supabaseAnonKey!);
}

// Example of how you *might* get the JWT in an App Router API route
// You would call createSupabaseAuthClient(getJwtFromRequest(request))
export function getJwtFromRequest(request: Request): string | undefined {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    return authorization.substring(7);
  }
  return undefined;
}

// For accessing Supabase as a service role (bypasses RLS) - use with extreme caution!
// This key should NEVER be exposed to the client. Keep it strictly server-side.
export function createSupabaseServiceRoleClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service role client');
  }
  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
    }
  });
}