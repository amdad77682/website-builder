import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/header-menus - Get all header menus (optionally filter by site_id)
export async function GET(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const { searchParams } = new URL(request.url);
  const site_id = searchParams.get('site_id');

  let query = supabase.from('header_menus').select('*');

  if (site_id) {
    query = query.eq('site_id', site_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching header menus:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/header-menus - Create a new header menu
export async function POST(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const body = await request.json();
  const { site_id, displayed_name, font_color, backdrop_color, items } = body;

  if (!site_id || !items) {
    return NextResponse.json(
      { error: 'site_id and items are required' },
      { status: 400 }
    );
  }
  if (!Array.isArray(items)) {
    return NextResponse.json(
      { error: 'items must be an array' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('header_menus')
    .insert({ site_id, displayed_name, font_color, backdrop_color, items })
    .select();

  if (error) {
    console.error('Error creating header menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ? data[0] : null, { status: 201 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function PATCH() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
