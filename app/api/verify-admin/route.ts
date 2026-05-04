import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST /api/verify-admin
// Called by the mobile app after BOTH OTPs are verified successfully.
// This endpoint signs in the admin using server-side credentials and returns
// a Supabase session — the mobile app NEVER needs to know the admin password.
//
// Body: { token: string }  — a simple request token to prevent abuse
// Returns: { success: true, session: {...} } | { success: false, error: string }

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
// A simple shared secret the mobile must include so random internet users
// can't call this endpoint. This is NOT the admin password.
const REQUEST_TOKEN = process.env.VERIFY_REQUEST_TOKEN || 'qardan-internal-2025';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    // Basic abuse prevention — not a security wall, just a speed bump.
    if (token !== REQUEST_TOKEN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('[verify-admin] ADMIN_EMAIL or ADMIN_PASSWORD env var is missing!');
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 });
    }

    // Use the anon key here — we're signing in as the user, not using service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (error || !data.session) {
      console.error('[verify-admin] Supabase signIn error:', error?.message);
      return NextResponse.json({ success: false, error: error?.message || 'Login failed' }, { status: 401 });
    }

    // Return the session to the mobile app so it can call supabase.auth.setSession()
    return NextResponse.json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
        user: data.session.user,
      },
    });
  } catch (err) {
    console.error('[verify-admin] Unexpected error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
