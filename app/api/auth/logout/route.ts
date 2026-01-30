import { NextResponse } from 'next/server';
import { clearCookie } from '@/lib/auth';

export async function POST() {
  const cookie = clearCookie();
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    }
  );
}
