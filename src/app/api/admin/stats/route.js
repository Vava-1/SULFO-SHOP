import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const stats = await getStats();
  return NextResponse.json({ stats });
}
