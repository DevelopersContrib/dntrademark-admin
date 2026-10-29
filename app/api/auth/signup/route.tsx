export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';
import { checkEmail } from '@/lib/auth-api';
import { createVerificationToken, sendVerificationEmail } from '@/lib/email-verification';

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

    const userId =
      result?.data?.id ?? result?.data?.data?.id ?? result?.id ?? null;

    if (userId) {
      try {
        const token = createVerificationToken(Number(userId), email);
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
