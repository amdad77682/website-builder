import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { NextResponse } from 'next/server';

// GET /api/pages - Get all pages
export async function GET(request: Request) {
  // For development, use service role to bypass RLS
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase.from('pages').select('*');
  if (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/pages - Create a new page
export async function POST(request: Request) {
  // For development, use service role to bypass RLS
  const supabase = createSupabaseServiceRoleClient();

  const body = await request.json();
  const { site_id, slug, title, order_index } = body;

  if (!site_id || !slug || !title) {
    return NextResponse.json({ error: 'site_id, slug, and title are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('pages')
    .insert({ site_id, slug, title, order_index })
    .select();

  if (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ? data[0] : null, { status: 201 });
}

// You can explicitly disallow other methods
export async function PUT() {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function PATCH() {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}