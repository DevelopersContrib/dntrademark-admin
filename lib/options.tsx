import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google';
import {saveUser} from '@/lib/data'
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
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Username:",
                    type: "text",
                    placeholder: "username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "password"
                }
            },
            async authorize(credentials : any) {
              console.log('authorize............',credentials);
                // if (credentials?.email === 'row.none@gmail.com' && credentials?.password === 'ronan132') {
                    return { id: "42", email:'row.none@gmail.com', name: 'ronan', password: 'ronan123' }
                // } else {
                //     return saveUser(credentials);
                // }

                
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                // const user = { id: "42", name: "Dave", password: "nextauth" }
                
                

                
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('diriiiiiiiiiiiiiiiiii');
            if(account?.provider!=='credentials'){
                const u: User = {
                    firstName: profile?.name?.split(' ')[0],
                    lastName: profile?.name?.split(' ')[1],
                    email: profile?.email,
                    password: profile?.email
                };
                
                saveUser(u);
            }
            //return 'https://www.dash.dntrademark.com/pricing'
            return true
        },
        async redirect({ url, baseUrl }) {
            console.log('redirect',url,baseUrl)
          return baseUrl
        },
        async session({ session, token, user }) {
          return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
          return token
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug:true
}