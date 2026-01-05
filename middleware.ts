import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname

      // Super admin routes
      if (path.startsWith('/superadmin')) {
        return token?.role === 'SUPER_ADMIN'
      }

      // Owner routes
      if (path.startsWith('/admin')) {
        return token?.role === 'SALON_OWNER' || token?.role === 'SUPER_ADMIN'
      }

      // Staff routes
      if (path.startsWith('/staff')) {
        return (
          token?.role === 'SALON_STAFF' ||
          token?.role === 'SALON_OWNER' ||
          token?.role === 'SUPER_ADMIN'
        )
      }

      return !!token
    },
  },
})

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/superadmin/:path*'],
}

