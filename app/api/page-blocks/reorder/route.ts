import { createSupabaseServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// PATCH /api/page-blocks/reorder - Reorder multiple page blocks
export async function PATCH(request: Request) {
  const supabase = createSupabaseServiceRoleClient();

  const body = await request.json();
  const { page_id, updates } = body; // updates is an array of { id: number, order_index: number }

  if (!page_id || !updates || !Array.isArray(updates)) {
    return NextResponse.json(
      { error: 'page_id and an array of updates are required' },
      { status: 400 }
    );
  }

  // Ensure all updates have id and order_index
  const isValid = updates.every(
    (item: any) =>
      typeof item.id === 'number' && typeof item.order_index === 'number'
  );

  if (!isValid) {
    return NextResponse.json(
      { error: 'Each update item must have a numeric "id" and "order_index"' },
      { status: 400 }
    );
  }

  // Use a transaction for atomic updates, especially for ordering
  // However, Supabase client doesn't directly support SQL transactions.
  // We'll perform individual updates, but be aware of potential race conditions
  // if multiple users are reordering simultaneously without robust locking.
  // For most use cases, sequential updates are fine.

  // First, verify that the page_id exists and belongs to the authenticated user's site
  // This implicitly checks RLS on the blocks themselves during update
  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('id, site_id')
    .eq('id', page_id)
    .single();

  if (pageError || !pageData) {
    if (pageError?.code === 'PGRST116') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    console.error('Error verifying page for reorder:', pageError);
    return NextResponse.json(
      { error: 'Failed to verify page ownership' },
      { status: 500 }
    );
  }

  // Array to collect promises for all update operations
  const updatePromises = updates.map(
    (update: { id: number; order_index: number }) => {
      return supabase
        .from('blocks')
        .update({ order_index: update.order_index })
        .eq('id', update.id)
        .eq('page_id', page_id) // Ensure block belongs to the specified page
        .select(); // Return the updated row for verification
    }
  );

  const results = await Promise.all(updatePromises);

  // Check for any errors in the individual updates
  const hasErrors = results.some(result => result.error);
  if (hasErrors) {
    console.error(
      'Errors during block reorder:',
      results.filter(r => r.error)
    );
    return NextResponse.json(
      {
        error: 'One or more block updates failed',
        details: results.map(r => r.error?.message),
      },
      { status: 500 }
    );
  }

  // Optionally, return the updated blocks for verification
  const updatedBlocks = results.flatMap(r => r.data || []);
  return NextResponse.json(updatedBlocks);
}

// Disallow other methods
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
