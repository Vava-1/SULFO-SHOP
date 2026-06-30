import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sulfo-secret-2024');
const COOKIE = 'sulfo_token';

export async function hashPassword(pwd) {
  return bcrypt.hash(pwd, 12);
}

export async function comparePassword(pwd, hash) {
  return bcrypt.compare(pwd, hash);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function setTokenCookie(response, token) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export function clearTokenCookie(response) {
  response.cookies.set(COOKIE, '', { maxAge: 0, path: '/' });
}

export function getTokenFromRequest(request) {
  return request.cookies.get(COOKIE)?.value || null;
}

export async function getUserFromRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
