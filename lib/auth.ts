import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Correo Electrónico', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales inválidas')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            salon: true,
            staffMember: true,
          },
        })

        if (!user || !(await compare(credentials.password, user.password))) {
          throw new Error('Credenciales inválidas')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          salonId: user.salonId,
          salonSlug: user.salon?.slug || null,
          staffMemberId: user.staffMemberId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.salonId = user.salonId
        token.salonSlug = user.salonSlug
        token.staffMemberId = user.staffMemberId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.salonId = token.salonId as string | null
        session.user.salonSlug = token.salonSlug as string | null
        session.user.staffMemberId = token.staffMemberId as string | null
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

