import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/page-blocks - Get all blocks (with optional page_id filter)
export async function GET(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const { searchParams } = new URL(request.url);
  const page_id = searchParams.get('page_id');

  let query = supabase.from('blocks').select('*');

  if (page_id) {
    query = query.eq('page_id', page_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/page-blocks - Create a new block
export async function POST(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const body = await request.json();
  const { page_id, type, config, order_index } = body;

  if (!page_id || !type) {
    return NextResponse.json(
      { error: 'page_id and type are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('blocks')
    .insert({ page_id, type, config, order_index })
    .select();

  if (error) {
    console.error('Error creating block:', error);
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
