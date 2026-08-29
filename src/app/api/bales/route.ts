import { NextResponse } from 'next/server';
import { MOCK_BALES } from '@/lib/mock-catalog';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: MOCK_BALES.length,
    data: MOCK_BALES,
  });
}
