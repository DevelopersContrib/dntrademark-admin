export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';
import { checkEmail } from '@/lib/auth-api';
import { createVerificationToken, sendVerificationEmail } from '@/lib/email-verification';
import { queryOne } from '@/lib/db';

/**
 * Extract the user id from a /user/save response body.
 * Mirrors the paths that extractSavedUser in lib/auth-api.ts checks:
 *   body.user.id | body.data.user.id | body.data.id
 */
function extractUserId(body: Record<string, unknown>): number | null {
  const pluck = (obj: unknown): number | null => {
    if (!obj || typeof obj !== 'object') return null;
    const id = (obj as Record<string, unknown>).id;
    return id != null ? Number(id) : null;
  };

  const user = body.user;
  if (pluck(user) != null) return pluck(user);

  const nested = body.data;
  if (nested && typeof nested === 'object') {
    const nd = nested as Record<string, unknown>;
    if (pluck(nd.user) != null) return pluck(nd.user);
    if (pluck(nd) != null) return pluck(nd);
  }

  return null;
}

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const email = (data.email ?? '').trim().toLowerCase();

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const { isEmailAvailable } = await checkEmail(email);
    if (!isEmailAvailable) {
      return NextResponse.json(
        { error: 'email_already_registered' },
        { status: 409 },
      );
    }

    const apiUrl = process.env.API_URL + '/user/save?api_key=' + process.env.API_KEY;

    const params = new URLSearchParams();
    params.append('first_name', data.firstName);
    params.append('last_name', data.lastName);
    params.append('email', email);
    params.append('password', data.password);

    const res = await axios.post(apiUrl, params);
    const result = res.data;

    let userId = extractUserId(result ?? {});

    if (userId == null) {
      try {
        const row = await queryOne<{ id: number }>(
          'SELECT id FROM users WHERE email = ? LIMIT 1',
          [email],
        );
        userId = row?.id ?? null;
      } catch (dbErr) {
        console.error('[signup] DB fallback lookup failed (non-blocking):', dbErr);
      }
    }

    if (userId == null) {
      console.warn('[signup] could not resolve user id after registration — verification email skipped');
    } else {
      try {
        const token = createVerificationToken(userId, email);
        await sendVerificationEmail(email, token);
      } catch (err) {
        console.error('[signup] verification email failed (non-blocking):', err);
      }
    }

    return NextResponse.json(result.data ?? { success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Sign up failed' }, { status: 500 });
  }
};
