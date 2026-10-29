import axios from 'axios';
import { User } from '@/types/user';
import { deriveOAuthPassword } from '@/lib/oauth-password';

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

/**
 * Walk through all envelope depths the Laravel API is known to use
 * ({ id }, { data: { id } }, { data: { data: { id } } }, etc.) and
 * return the first object that contains an `id` field.  This keeps
 * userExists() in sync with checkEmail(), which already checks
 * data.data.data.id — a mismatch between the two caused an existing
 * user to be routed to the register path, silently overwriting their
 * password.
 */
function findUserObject(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object') return null;
  let cursor: unknown = payload;
  for (let depth = 0; depth < 4; depth++) {
    if (!cursor || typeof cursor !== 'object') break;
    const obj = cursor as Record<string, unknown>;
    if (obj.id != null) return obj;
    cursor = obj.data;
  }
  return null;
}

function extractExistingUser(payload: unknown): { id: string; firstName?: string } | null {
  const user = findUserObject(payload);
  if (!user) return null;

  return {
    id: String(user.id),
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

  return findUserObject(payload) !== null;
}

export const checkEmail = async (email: string) => {
  try {
    const apiUrl =
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      encodeURIComponent(email);

    const result = await axios.get(apiUrl, { timeout: 10000 });
    const id = result.data?.data?.data?.id ?? result.data?.data?.id;
    return id ? { isEmailAvailable: false } : { isEmailAvailable: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[auth] checkEmail error:', msg);
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

const LOGIN_REJECTED_STATUSES = new Set([401, 403, 422]);

async function loginWithApi(email: string, password: string): Promise<string | null> {
  const loginUrl = process.env.API_URL + '/auth/login?api_key=' + process.env.API_KEY;
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);

  let loginRes;
  try {
    loginRes = await axios.post(loginUrl, params, { timeout: 15000 });
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response && LOGIN_REJECTED_STATUSES.has(err.response.status)) {
      console.warn(`[auth] login rejected (status ${err.response.status})`);
      return null;
    }
    throw err;
  }

  const token = extractToken(loginRes.data);

  if (!token) {
    console.warn('[auth] Login response missing token for', email);
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
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      encodeURIComponent(email);
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
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[auth] authorizeUser error:', email, status ?? '', msg);
    return null;
  }
};

export type OAuthUserResult =
  | { ok: true; id: string; email: string; name: string; token: string }
  | { ok: false; reason: 'account_not_linked' | 'api_error' };

/**
 * OAuth-specific variant of authorizeUser.
 *
 * New user → register via the Laravel API with a derived HMAC password.
 * Existing user → try login with the derived password first; if that fails,
 * fall back to the legacy email-as-password login when OAUTH_LEGACY_LOGIN
 * is enabled (default: enabled, set to 'false' to disable once all accounts
 * have been migrated).
 *
 * If the user originally signed up with a real password the login fails.
 * We intentionally fail closed here — never call /user/save for an existing
 * user because that could reset their password, which is an account takeover.
 */
export async function authorizeOAuthUser(
  email: string,
  displayName: string,
): Promise<OAuthUserResult> {
  if (!email || !process.env.API_URL || !process.env.API_KEY) {
    console.error('[auth] Missing email or API env for authorizeOAuthUser');
    return { ok: false, reason: 'api_error' };
  }

  const derivedPassword = deriveOAuthPassword(email);
  if (!derivedPassword) {
    return { ok: false, reason: 'api_error' };
  }

  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';

  const credentials: User = {
    firstName,
    lastName,
    email,
    password: derivedPassword,
  };

  try {
    const checkUrl =
      process.env.API_URL +
      '/user/check?api_key=' +
      process.env.API_KEY +
      '&email=' +
      encodeURIComponent(email);
    const checkRes = await axios.get(checkUrl, { timeout: 15000 });
    const exists = userExists(checkRes.data);

    if (!exists) {
      const registered = await registerWithApi(credentials);
      if (!registered?.token) return { ok: false, reason: 'api_error' };
      return { ok: true, ...registered };
    }

    const existingUser = extractExistingUser(checkRes.data);

    const token = await loginWithApi(email, derivedPassword);
    if (token) {
      return {
        ok: true,
        id: existingUser?.id ?? email,
        email,
        name: existingUser?.firstName ?? firstName,
        token,
      };
    }

    const legacyEnabled = process.env.OAUTH_LEGACY_LOGIN !== 'false';
    if (legacyEnabled) {
      const legacyToken = await loginWithApi(email, email);
      if (legacyToken) {
        console.warn(
          `[auth] legacy oauth login used for user id ${existingUser?.id ?? 'unknown'}`,
        );
        return {
          ok: true,
          id: existingUser?.id ?? email,
          email,
          name: existingUser?.firstName ?? firstName,
          token: legacyToken,
        };
      }
    }

    console.warn(
      `[auth] OAuth: cannot log in existing user id ${existingUser?.id ?? 'unknown'}, failing closed`,
    );
    return { ok: false, reason: 'account_not_linked' };
  } catch (error: unknown) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[auth] authorizeOAuthUser error:', status ?? '', msg);
    return { ok: false, reason: 'api_error' };
  }
}

/**
 * Resolve the user's email from the OAuth profile.
 *
 * For GitHub we always hit the /user/emails API to confirm the email is
 * **verified**. An unverified primary email is rejected — without this check
 * an attacker could add someone else's email to their GitHub account (without
 * verifying it) and use OAuth to impersonate that address.
 *
 * Google emails are verified by definition (Google requires it).
 */
export async function resolveOAuthEmail(
  profile: { email?: string | null; name?: string | null } | null | undefined,
  user: { email?: string | null; name?: string | null },
  provider?: string | null,
  accessToken?: string | null,
): Promise<string | null> {
  if (provider === 'github' && accessToken) {
    return resolveVerifiedGitHubEmail(accessToken);
  }

  return profile?.email ?? user.email ?? null;
}

async function resolveVerifiedGitHubEmail(accessToken: string): Promise<string | null> {
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

    const verified =
      emails.find((e) => e.primary && e.verified)?.email ??
      emails.find((e) => e.verified)?.email ??
      null;

    if (!verified) {
      console.error('[auth] GitHub account has no verified email — rejecting sign-in');
    }

    return verified;
  } catch (error) {
    console.error('[auth] GitHub email fetch error:', error);
    return null;
  }
}
