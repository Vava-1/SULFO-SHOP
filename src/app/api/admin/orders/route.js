import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderStatus } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, status } = await req.json();
  const order = await updateOrderStatus(id, status);
  return NextResponse.json({ order });
}
