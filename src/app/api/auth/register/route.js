import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';
import { signToken, setTokenCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    const existing = await findUserByEmail(email);
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    const user = await createUser({ name, email, password });
    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
    setTokenCookie(res, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
