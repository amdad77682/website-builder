import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/page-blocks - Get all blocks (with optional page_id filter)
export async function GET(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const { searchParams } = new URL(request.url);
  const page_id = searchParams.get('page_id');

  let query = supabase.from('blocks').select('*');

  if (page_id) {
    query = query
      .eq('page_id', page_id)
      .order('order_index', { ascending: true }); // Order by index for GET
  } else {
    // If no page_id, still order for consistency if fetching all blocks
    query = query
      .order('page_id', { ascending: true })
      .order('order_index', { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/page-blocks - Create a new block with incremental order_index
export async function POST(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const body = await request.json();
  const { page_id, type, config } = body; // order_index is no longer passed by client

  if (!page_id || !type) {
    return NextResponse.json(
      { error: 'page_id and type are required' },
      { status: 400 }
    );
  }

  // --- Start of new logic for incremental order_index ---

  // 1. Find the current maximum order_index for this page_id
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('blocks')
    .select('order_index')
    .eq('page_id', page_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  if (maxOrderError && maxOrderError.code !== 'PGRST116') {
    // PGRST116 means "no rows found" - which is fine
    console.error('Error fetching max order_index:', maxOrderError);
    return NextResponse.json(
      { error: 'Failed to determine block order' },
      { status: 500 }
    );
  }

  const newOrderIndex = (maxOrderData?.order_index || -1) + 1;
  // If no blocks exist for this page_id, maxOrderData will be null, and newOrderIndex will be 0.
  // If blocks exist, it will be max + 1.

  // --- End of new logic ---

  const { data, error } = await supabase
    .from('blocks')
    .insert({
      page_id,
      type,
      config,
      order_index: newOrderIndex, // Use the calculated order_index
    })
    .select();

  if (error) {
    console.error('Error creating block:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ? data[0] : null, { status: 201 });
}

// Disallow other methods
export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function PATCH() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
