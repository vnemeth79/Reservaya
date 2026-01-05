import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import WorkingHoursForm from '@/components/admin/WorkingHoursForm'

export const metadata = {
  title: 'Horarios | ReservaYa',
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

export default async function HorariosPage() {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  const staffMembers = await prisma.staffMember.findMany({
    where: { ...getSalonFilter(user), active: true },
    include: {
      workingHours: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Horarios de Trabajo</h1>
        <p className="text-gray-600 mt-1">
          Configura los horarios de atención de tu personal
        </p>
      </div>

      {staffMembers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏰</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay personal registrado
          </h3>
          <p className="text-gray-500">
            Primero debes agregar personal para configurar sus horarios
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {staff.name}
              </h2>
              <WorkingHoursForm
                staffId={staff.id}
                workingHours={staff.workingHours}
                daysOfWeek={DAYS_OF_WEEK}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

