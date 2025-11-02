import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/page-blocks/[id] - Get a single block by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Block ID is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }
    console.error('Error fetching block:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PUT /api/page-blocks/[id] - Update a block by ID (full replacement)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = params;
  const body = await request.json();
  const { page_id, type, config, order_index } = body; // All fields expected for PUT

  if (!id) {
    return NextResponse.json(
      { error: 'Block ID is required' },
      { status: 400 }
    );
  }
  if (!page_id || !type) {
    // Basic validation for PUT
    return NextResponse.json(
      { error: 'page_id and type are required for PUT' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('blocks')
    .update({ page_id, type, config, order_index })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating block:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Block not found or nothing to update' },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

// PATCH /api/page-blocks/[id] - Update a block by ID (partial update)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = params;
  const body = await request.json(); // Body can contain partial data

  if (!id) {
    return NextResponse.json(
      { error: 'Block ID is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('blocks')
    .update(body) // Update with whatever is in the body
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating block:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Block not found or nothing to update' },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

// DELETE /api/page-blocks/[id] - Delete a block by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServiceRoleClient();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Block ID is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('blocks').delete().eq('id', id);

  if (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new Response(null, { status: 204 }); // No content on successful deletion
}

// You can explicitly disallow other methods
export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
