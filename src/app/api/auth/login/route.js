import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';
import { comparePassword, signToken, setTokenCookie, clearTokenCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    const valid = await comparePassword(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    setTokenCookie(res, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearTokenCookie(res);
  return res;
}
