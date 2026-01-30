import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextRequest } from 'next/server';

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function signToken(payload: object) {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign(payload, secret, {
    expiresIn: MAX_AGE,
  });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || 'secret';
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

export function setCookie(token: string) {
  return serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export function clearCookie() {
  return serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });
}

export function getTokenFromRequest(req: NextRequest) {
  return req.cookies.get('token')?.value;
}
