import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        whatsapp: { label: 'WhatsApp', type: 'text' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.whatsapp) {
          throw new Error('WhatsApp number is required')
        }

        const user = await prisma.user.findUnique({
          where: { whatsapp: credentials.whatsapp },
        })

        if (!user) {
          throw new Error('User not found')
        }

        // OTP Login
        if (credentials.otp) {
          if (user.otp === credentials.otp && user.otpExpiry && new Date() < user.otpExpiry) {
            // Clear OTP after successful login
            await prisma.user.update({
              where: { id: user.id },
              data: { otp: null, otpExpiry: null },
            })
            return {
              id: user.id,
              name: user.fullName,
              email: user.email,
              whatsapp: user.whatsapp,
              role: user.role,
            }
          }
          throw new Error('Invalid or expired OTP')
        }

        // Password Login
        if (credentials.password && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (isValid) {
            return {
              id: user.id,
              name: user.fullName,
              email: user.email,
              whatsapp: user.whatsapp,
              role: user.role,
            }
          }
        }

        throw new Error('Invalid credentials')
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.whatsapp = (user as { whatsapp?: string }).whatsapp
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        (session.user as { role?: string }).role = token.role as string
        (session.user as { whatsapp?: string }).whatsapp = token.whatsapp as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
