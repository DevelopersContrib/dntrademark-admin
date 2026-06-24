import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authorizeUser, resolveOAuthEmail } from '@/lib/auth-api';
import { authPath, getAuthBaseUrl } from '@/lib/auth-url';

interface OAuthUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token?: string;
  id?: string;
}

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;

export const options: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin-error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Username:',
          type: 'text',
          placeholder: 'username',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'password',
        },
      },
      async authorize(credentials: any) {
        const user = await authorizeUser(credentials);
        if (!user?.token) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          token: user.token,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return !!user?.token;
      }

      try {
        const email = await resolveOAuthEmail(
          profile as { email?: string | null; name?: string | null } | null,
          user,
          account?.provider,
          account?.access_token,
        );

        if (!email) {
          console.error('[auth] OAuth sign-in missing email from provider:', account?.provider);
          return false;
        }

        const nameParts = (profile?.name ?? user.name ?? email.split('@')[0] ?? 'User').split(' ');
        const payload: OAuthUserPayload = {
          firstName: nameParts[0] || 'User',
          lastName: nameParts.slice(1).join(' ') || '',
          email,
          password: email,
        };

        const apiUser = await authorizeUser(payload);
        if (!apiUser?.token) {
          console.error('[auth] Backend rejected OAuth user:', email, account?.provider);
          return false;
        }

        user.id = apiUser.id;
        user.email = apiUser.email;
        user.name = apiUser.name;
        user.token = apiUser.token;

        return true;
      } catch (error) {
        console.error('[auth] OAuth signIn callback error:', account?.provider, error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      const origin = getAuthBaseUrl() || baseUrl.replace(/\/$/, '');

      if (url.includes('error=')) {
        const errorParam = new URL(url, origin).searchParams.get('error');
        if (errorParam) {
          return authPath(`/auth/signin-error?error=${encodeURIComponent(errorParam)}`);
        }
      }

      if (url.startsWith('/auth/signin-error')) {
        return authPath(url);
      }

      if (url.startsWith('/')) return authPath(url);

      try {
        const target = new URL(url);
        const originHost = new URL(origin).origin;
        if (target.origin === originHost || target.origin === new URL(baseUrl).origin) {
          return url;
        }
      } catch {
        return origin;
      }

      return origin;
    },
    async session({ session, token }) {
      session.token = token.token;
      session.id = token.id;
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.token = user.token;
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      if ('account' in message && message.account?.provider) {
        console.info('[auth] Signed in via', message.account.provider);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies,
};
