import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { categories, subCategories } from '@/db/schema';
import { CATEGORIES } from '@/lib/mock-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isDatabaseConfigured()) {
      try {
        const dbCategories = await db.select().from(categories).all();
        const dbSubCategories = await db.select().from(subCategories).all();

        if (dbCategories.length > 0) {
          const nested = dbCategories
            .filter((c) => c.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cat) => ({
              ...cat,
              subCategories: dbSubCategories.filter((s) => s.categoryId === cat.id && s.isActive),
            }));

          return NextResponse.json({
            success: true,
            source: 'turso_db',
            categories: nested,
          });
        }
      } catch (dbErr) {
        console.warn('Database query fallback to seed categories:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      source: 'catalog_seed',
      categories: CATEGORIES,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
