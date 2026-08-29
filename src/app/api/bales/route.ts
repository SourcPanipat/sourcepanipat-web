import { NextRequest, NextResponse } from 'next/server';
import { MOCK_BALES, searchBales } from '@/lib/mock-catalog';
import { isDatabaseConfigured, db } from '@/db';
import { bales as balesTable } from '@/db/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';

  try {
    // If DB credentials exist, query DB; otherwise use mock catalog
    if (isDatabaseConfigured()) {
      try {
        const results = await db.select().from(balesTable);
        if (results && results.length > 0) {
          return NextResponse.json({ success: true, count: results.length, data: results });
        }
      } catch (dbError) {
        console.warn('Database query fallback to mock catalog:', dbError);
      }
    }

    const filtered = searchBales(query, category);
    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
