import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import StaffList from '@/components/admin/StaffList'
import AddStaffButton from '@/components/admin/AddStaffButton'

export const metadata = {
  title: 'Gestión de Personal | ReservaYa',
}

export default async function PersonalPage() {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  const staff = await prisma.staffMember.findMany({
    where: getSalonFilter(user),
    include: {
      user: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const services = await prisma.service.findMany({
    where: getSalonFilter(user),
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Personal
          </h1>
          <p className="text-gray-600 mt-1">
            Administra tu equipo de profesionales
          </p>
        </div>
        <AddStaffButton services={services} salonId={user.salonId!} />
      </div>

      {staff.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay personal registrado
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega tu primer profesional para comenzar a recibir reservas
          </p>
        </div>
      ) : (
        <StaffList staff={staff} services={services} />
      )}
    </div>
  )
}

