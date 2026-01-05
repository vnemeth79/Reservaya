import { requireAuth } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata = {
  title: 'Panel de Administración | ReservaYa',
  description: 'Gestiona tu salón de belleza',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  if (!user.salonId && user.role !== 'SUPER_ADMIN') {
    redirect('/login')
  }

  const salon = user.salonId
    ? await prisma.salon.findUnique({ where: { id: user.salonId } })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} salonName={salon?.name || 'ReservaYa'} />
      <div className="flex">
        <AdminSidebar salonSlug={salon?.slug} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}

