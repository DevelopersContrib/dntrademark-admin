import type { NextAuthOptions } from 'next-auth';
<<<<<<< HEAD
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authorizeUser, checkEmail, loginUser } from '@/lib/data';
interface User {
  firstName: any;
  lastName: any;
  email: any;
  password: any;
}

export const options: NextAuthOptions = {
  pages: {
    // signIn: '/auth/signup',
    signIn: '/auth/signup',
    // signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
=======
import GitHubProviders from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    GitHubProviders({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
>>>>>>> parent of 8db178e (implement nextauth)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
<<<<<<< HEAD
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
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider !== 'credentials') {
        const user: User = {
          firstName: profile?.name?.split(' ')[0],
          lastName: profile?.name?.split(' ')[1],
          email: profile?.email,
          password: profile?.email,
        };

        saveUser(user);
      }
      //return 'https://www.dash.dntrademark.com/pricing'
=======
          label: 'Email',
          type: 'text',
          placeholder: 'Email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials, req) {
        const res = await fetch('/your/endpoint', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(email);
      console.log(credentials);
>>>>>>> parent of 8db178e (implement nextauth)
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('redirect', url, baseUrl);
      return baseUrl;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
<<<<<<< HEAD
  debug: true,
=======
>>>>>>> parent of 8db178e (implement nextauth)
};
