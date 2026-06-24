import axios from 'axios';
import { User } from '@/types/user';

// The backend issues Laravel-style tokens as "<id>|<hash>" but its authenticated
// endpoints only accept the "<hash>" portion as the Bearer token. Sending the full
// "<id>|<hash>" string results in 401 Unauthorized, which silently logs the user out.
function normalizeToken(token: string): string {
  const pipeIndex = token.indexOf('|');
  return pipeIndex >= 0 ? token.slice(pipeIndex + 1) : token;
}

function extractToken(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as Record<string, unknown>;
  const nested = data.data;
  if (typeof data.token === 'string') return normalizeToken(data.token);
  if (nested && typeof nested === 'object') {
    const nestedData = nested as Record<string, unknown>;
    if (typeof nestedData.token === 'string') return normalizeToken(nestedData.token);
  }
  return null;
}

function extractSavedUser(payload: unknown): { id: string; email: string; name: string } | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as Record<string, unknown>;
  const user =
    data.user ??
    (data.data && typeof data.data === 'object'
      ? (data.data as Record<string, unknown>).user ?? data.data
      : null);

  if (!user || typeof user !== 'object') return null;

  const record = user as Record<string, unknown>;
  const id = record.id;
  const email = record.email;

  if (id == null || typeof email !== 'string') return null;

  const firstName =
    typeof record.first_name === 'string'
      ? record.first_name
      : typeof record.firstName === 'string'
        ? record.firstName
        : email;

  return {
    id: String(id),
    email,
    name: firstName,
  };
}

function extractExistingUser(payload: unknown): { id: string; firstName?: string } | null {
  if (!payload || typeof payload !== 'object') return null;
  const root = payload as Record<string, unknown>;
  const envelope =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : root;
  const user =
    envelope.data && typeof envelope.data === 'object'
      ? (envelope.data as Record<string, unknown>)
      : envelope;

  const id = user.id;
  if (id == null) return null;

  return {
    id: String(id),
    firstName:
      typeof user.first_name === 'string'
        ? user.first_name
        : typeof user.firstName === 'string'
          ? user.firstName
          : undefined,
  };
}

function userExists(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false;
  const root = payload as Record<string, unknown>;
  if (root.success === false) return false;
  const envelope =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : root;
  if (envelope.success === false) return false;
  return extractExistingUser(payload) !== null;
}

export const checkEmail = async (email: string) => {
  try {
    const apiUrl =
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      email;

    const result = await axios.get(apiUrl, { timeout: 10000 });
    const id = result.data?.data?.data?.id ?? result.data?.data?.id;
    return id ? { isEmailAvailable: false } : { isEmailAvailable: true };
  } catch (error) {
    console.log('Error', error);
    return { isEmailAvailable: true };
  }
};

export const loginUser = async () => {
  try {
    await fetch('/api/auth/signin', {
      method: 'POST',
    });
  } catch (error) {
    console.log('Error', error);
  }
};

export const saveUser = async (values: User) => {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const result = await res.json();

    if (result.data?.id) {
      return { id: result.data.id, name: values.firstName };
    }
  } catch (error) {
    console.log('Error', error);
  }
};

async function loginWithApi(email: string, password: string) {
  const loginUrl = process.env.API_URL + '/auth/login?api_key=' + process.env.API_KEY;
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);

  const loginRes = await axios.post(loginUrl, params, { timeout: 15000 });
  const token = extractToken(loginRes.data);

  if (!token) {
    console.error('[auth] Login response missing token:', email, loginRes.data);
    return null;
  }

  return token;
}

async function registerWithApi(credentials: User) {
  const saveUrl = process.env.API_URL + '/user/save?api_key=' + process.env.API_KEY;
  const params = new URLSearchParams();
  params.append('first_name', (credentials.firstName as string) || 'User');
  params.append('last_name', (credentials.lastName as string) || '');
  params.append('email', credentials.email as string);
  params.append('password', credentials.password as string);

  const saveRes = await axios.post(saveUrl, params, { timeout: 15000 });
  const savedUser = extractSavedUser(saveRes.data);
  const token = extractToken(saveRes.data);

  if (!savedUser?.id) {
    console.error('[auth] Register response missing user:', credentials.email, saveRes.data);
    return null;
  }

  if (token) {
    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      token,
    };
  }

  const loginToken = await loginWithApi(
    credentials.email as string,
    credentials.password as string,
  );

  if (!loginToken) return null;

  return {
    id: savedUser.id,
    email: savedUser.email,
    name: savedUser.name,
    token: loginToken,
  };
}

export const authorizeUser = async (credentials: User) => {
  if (!credentials?.email || !process.env.API_URL || !process.env.API_KEY) {
    console.error('[auth] Missing email or API env for authorizeUser');
    return null;
  }

  const email = credentials.email as string;
  const password = credentials.password as string;

  try {
    const checkUrl =
      process.env.API_URL + '/user/check?api_key=' + process.env.API_KEY + '&email=' + email;
    const checkRes = await axios.get(checkUrl, { timeout: 15000 });
    const exists = userExists(checkRes.data);

    if (exists) {
      const existingUser = extractExistingUser(checkRes.data);
      const token = await loginWithApi(email, password);

      if (!token) {
        console.error('[auth] Login failed for existing user:', email);
        return null;
      }

      return {
        id: existingUser?.id ?? email,
        email,
        name: existingUser?.firstName ?? email,
        token,
      };
    }

    return registerWithApi(credentials);
  } catch (error) {
    console.error('[auth] authorizeUser error:', email, error);
    return null;
  }
};

export async function resolveOAuthEmail(
  profile: { email?: string | null; name?: string | null } | null | undefined,
  user: { email?: string | null; name?: string | null },
  provider?: string | null,
  accessToken?: string | null,
): Promise<string | null> {
  const directEmail = profile?.email ?? user.email ?? null;
  if (directEmail) return directEmail;

  if (provider !== 'github' || !accessToken) return null;

  try {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      console.error('[auth] GitHub email fetch failed:', response.status);
      return null;
    }

    const emails = (await response.json()) as Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>;

    return (
      emails.find((entry) => entry.primary && entry.verified)?.email ??
      emails.find((entry) => entry.verified)?.email ??
      emails[0]?.email ??
      null
    );
  } catch (error) {
    console.error('[auth] GitHub email fetch error:', error);
    return null;
  }
}
