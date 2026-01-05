import { requireAuth } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import StaffHeader from '@/components/staff/StaffHeader'

export const metadata = {
  title: 'Mi Agenda | ReservaYa',
  description: 'Gestiona tus citas',
}

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth(['SALON_STAFF', 'SALON_OWNER', 'SUPER_ADMIN'])

  if (!user.staffMemberId && user.role === 'SALON_STAFF') {
    redirect('/login')
  }

  const staffMember = user.staffMemberId
    ? await prisma.staffMember.findUnique({
        where: { id: user.staffMemberId },
        include: { salon: true },
      })
    : null

  const salon = staffMember?.salon || 
    (user.salonId ? await prisma.salon.findUnique({ where: { id: user.salonId } }) : null)

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffHeader staffMember={staffMember} salonName={salon?.name || 'ReservaYa'} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">{children}</main>
    </div>
  )
}

