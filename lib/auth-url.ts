/**
 * Canonical app origin for NextAuth redirects and OAuth callbacks.
 * Always prefer NEXTAUTH_URL so local/dev requests don't drift to the wrong host.
 */
export function getAuthBaseUrl(): string {
  const configured = process.env.NEXTAUTH_URL?.replace(/\/$/, '');
  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }

  return 'http://localhost:3000';
}

export function authPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getAuthBaseUrl()}${normalized}`;
}
