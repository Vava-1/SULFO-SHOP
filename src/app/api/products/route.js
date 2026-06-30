import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = {
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      inStock: searchParams.get('inStock') === 'true',
    };
    const products = await getAllProducts(filter);
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
