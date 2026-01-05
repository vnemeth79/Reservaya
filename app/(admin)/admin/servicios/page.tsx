import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import ServicesList from '@/components/admin/ServicesList'
import AddServiceButton from '@/components/admin/AddServiceButton'

export const metadata = {
  title: 'Servicios | ReservaYa',
}

export default async function ServiciosPage() {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  const services = await prisma.service.findMany({
    where: getSalonFilter(user),
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Servicios</h1>
          <p className="text-gray-600 mt-1">
            Administra los servicios que ofrece tu salón
          </p>
        </div>
        <AddServiceButton salonId={user.salonId!} />
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✂️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay servicios registrados
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega tu primer servicio para comenzar
          </p>
        </div>
      ) : (
        <ServicesList services={services} />
      )}
    </div>
  )
}

