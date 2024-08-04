import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return user;
        }
        return null;
      }
    }),
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials.email === process.env.ADMIN_EMAIL && credentials.password === process.env.ADMIN_PASSWORD) {
          return { id: 'admin', email: credentials.email, isAdmin: true };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 90 * 60, // Session max age in seconds (90 minutes)
    updateAge: 24 * 60 * 60, // Optional: session update age in seconds (1 day)
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.isAdmin) {
        token.isAdmin = true;
      }
      if (user) {
        token.isSubscribed = user.isSubscribed;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.sub;
      session.isAdmin = token.isAdmin;
      session.isSubscribed = token.isSubscribed;
      return session;
    },
  },
};

// Named export for GET
export async function GET(req, res) {
  return await NextAuth(req, res, authOptions);
}

// Named export for POST
export async function POST(req, res) {
  return await NextAuth(req, res, authOptions);
}
