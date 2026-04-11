import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  // Use env secret, or fallback to prevent build errors on Vercel
  secret: process.env.NEXTAUTH_SECRET || 'extraordinary-fallback-secret-for-demo',
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login', error: '/login' },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) throw new Error('Invalid input');

        // Demo mode: accept any credentials when no DB is connected
        if (!process.env.DATABASE_URL) {
          return {
            id: 'demo-user-id',
            email: parsed.data.email,
            name: 'Demo User',
            image: null,
          };
        }

        const { email, password } = parsed.data;
        
        // Use a generic error message for security (prevents user enumeration)
        const invalidCredentialsError = new Error('Invalid email or password');

        const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

        if (!user) throw invalidCredentialsError;

        // Check lockout
        if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
          throw new Error('Account locked due to too many failed attempts. Try again in 15 minutes.');
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        
        if (!valid) {
          // Increment failed attempts efficiently (atomic update)
          const newAttempts = (user.failedAttempts || 0) + 1;
          const updates: Record<string, unknown> = { failedAttempts: newAttempts };
          
          if (newAttempts >= 5) {
            updates.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins block
          }
          
          await db.update(users).set(updates as Record<string, unknown>).where(eq(users.id, user.id));
          
          if (newAttempts >= 5) {
            throw new Error('Account locked due to too many failed attempts. Try again in 15 minutes.');
          }
          
          throw invalidCredentialsError;
        }

        // Reset failed attempts on success if they were previously tracked
        if (user.failedAttempts && user.failedAttempts > 0) {
          await db.update(users).set({ failedAttempts: 0, lockoutUntil: null } as Record<string, unknown>).where(eq(users.id, user.id));
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName || `${user.firstName} ${user.lastName}`,
          image: user.avatarUrl,
          field: user.field,
          onboardingComplete: user.onboardingComplete,
          isApprovedHolder: user.isApprovedHolder,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const extUser = user as { id: string; field?: string; onboardingComplete?: boolean; isApprovedHolder?: boolean };
        token.id = extUser.id;
        token.field = extUser.field;
        token.onboardingComplete = extUser.onboardingComplete ?? true;
        token.isApprovedHolder = extUser.isApprovedHolder ?? false;
      }
      // Support session updates from the client
      if (trigger === 'update' && session) {
        token = { ...token, ...(session as Record<string, unknown>) };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const sessUser = session.user as any;
        sessUser.id = token.id as string;
        sessUser.field = token.field as string;
        sessUser.onboardingComplete = token.onboardingComplete as boolean;
        sessUser.isApprovedHolder = token.isApprovedHolder as boolean;
      }
      return session;
    },
  },
};
