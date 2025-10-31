import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/pages/[id] - Get a single page by ID
export async function GET(request: NextRequest, context: RouteContext) {
  const supabase = createSupabaseServiceRoleClient();
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PUT /api/pages/[id] - Update a page by ID (full replacement)
export async function PUT(request: NextRequest, context: RouteContext) {
  const supabase = createSupabaseServiceRoleClient();
  const { id } = await context.params;
  const body = await request.json();
  const { site_id, slug, title, order_index } = body; // All fields expected for PUT

  if (!id) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }
  if (!site_id || !slug || !title) {
    // Basic validation for PUT
    return NextResponse.json(
      { error: 'site_id, slug, and title are required for PUT' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('pages')
    .update({ site_id, slug, title, order_index })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Page not found or nothing to update' },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

// PATCH /api/pages/[id] - Update a page by ID (partial update)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const supabase = createSupabaseServiceRoleClient();
  const { id } = await context.params;
  const body = await request.json(); // Body can contain partial data

  if (!id) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('pages')
    .update(body) // Update with whatever is in the body
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Page not found or nothing to update' },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

// DELETE /api/pages/[id] - Delete a page by ID
export async function DELETE(request: NextRequest, context: RouteContext) {
  const supabase = createSupabaseServiceRoleClient();
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  const { error } = await supabase.from('pages').delete().eq('id', id);

  if (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new Response(null, { status: 204 }); // No content on successful deletion
}

// POST /api/pages/[id] - Create a new page with a specific ID
export async function POST(request: NextRequest, context: RouteContext) {
  const supabase = createSupabaseServiceRoleClient();
  const { id } = await context.params;
  const body = await request.json();
  const { site_id, slug, title, order_index } = body;

  if (!id) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }
  if (!site_id || !slug || !title) {
    return NextResponse.json(
      { error: 'site_id, slug, and title are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('pages')
    .insert({ id, site_id, slug, title, order_index })
    .select()
    .single();

  if (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
