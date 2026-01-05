import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect('/login')
  }

  return user
}

// Query filter helpers
export function getSalonFilter(user: any) {
  if (user.role === 'SUPER_ADMIN') return {}
  return { salonId: user.salonId }
}

export function getStaffFilter(user: any) {
  if (user.role === 'SUPER_ADMIN' || user.role === 'SALON_OWNER') {
    return user.salonId ? { salonId: user.salonId } : {}
  }
  return { id: user.staffMemberId }
}

