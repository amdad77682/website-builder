import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/header-menus/[id] - Get a single header menu by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Header menu ID is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('header_menus')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return NextResponse.json(
        { error: 'Header menu not found' },
        { status: 404 }
      );
    }
    console.error('Error fetching header menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PUT /api/header-menus/[id] - Update a header menu by ID (full replacement)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = await params;
  const body = await request.json();
  const { site_id, displayed_name, font_color, backdrop_color, items } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Header menu ID is required' },
      { status: 400 }
    );
  }
  if (!site_id || !items) {
    return NextResponse.json(
      { error: 'site_id and items are required for PUT' },
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
    .update({ site_id, displayed_name, font_color, backdrop_color, items })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating header menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Header menu not found or nothing to update' },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

// PATCH /api/header-menus/[id] - Update a header menu by ID (partial update)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = await params;
  const body = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Header menu ID is required' },
      { status: 400 }
    );
  }
  if (body.items && !Array.isArray(body.items)) {
    return NextResponse.json(
      { error: 'items must be an array if provided' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('header_menus')
    .update(body) // Update with whatever is in the body
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating header menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Header menu not found or nothing to update' },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

// DELETE /api/header-menus/[id] - Delete a header menu by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Header menu ID is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('header_menus').delete().eq('id', id);

  if (error) {
    console.error('Error deleting header menu:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new Response(null, { status: 204 });
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
