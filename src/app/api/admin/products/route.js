import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const data = await req.json();
  const product = await createProduct(data);
  return NextResponse.json({ product }, { status: 201 });
}
