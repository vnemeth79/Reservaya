import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import SalonSettingsForm from '@/components/admin/SalonSettingsForm'

export const metadata = {
  title: 'Configuración | ReservaYa',
}

export default async function ConfiguracionPage() {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  const salon = user.salonId
    ? await prisma.salon.findUnique({ where: { id: user.salonId } })
    : null

  if (!salon) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontró el salón</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-1">
          Administra la información de tu salón
        </p>
      </div>

      <SalonSettingsForm salon={salon} />
    </div>
  )
}

