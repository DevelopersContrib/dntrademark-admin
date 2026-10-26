import { createHmac } from 'crypto';

/**
 * Derive a deterministic password for OAuth-created accounts.
 *
 * password = HMAC-SHA256(key = OAUTH_PASSWORD_SECRET, data = lowercase-trimmed email)
 * encoded as base64url (43 chars, well within Laravel's bcrypt-input limit).
 *
 * Returns null when OAUTH_PASSWORD_SECRET is missing or too short (< 32 chars),
 * which callers treat as a hard failure — OAuth sign-in is unavailable until the
 * secret is configured.
 */
export function deriveOAuthPassword(email: string): string | null {
  const secret = process.env.OAUTH_PASSWORD_SECRET;

  if (!secret || secret.length < 32) {
    console.error('[auth] OAUTH_PASSWORD_SECRET missing or too short — OAuth sign-in blocked');
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hmac = createHmac('sha256', secret);
  hmac.update(normalizedEmail);
  return hmac.digest('base64url');
}
