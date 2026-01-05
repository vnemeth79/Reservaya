import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import BookingFlow from '@/components/booking/BookingFlow'

export async function generateMetadata({
  params,
}: {
  params: { salonSlug: string }
}) {
  const salon = await prisma.salon.findUnique({
    where: { slug: params.salonSlug },
  })

  return {
    title: `Reserva tu Cita | ${salon?.name || 'Salón'}`,
    description: `Reserva tu cita en ${salon?.name} en segundos`,
  }
}

export default async function PublicBookingPage({
  params,
}: {
  params: { salonSlug: string }
}) {
  const salon = await prisma.salon.findUnique({
    where: { slug: params.salonSlug },
    include: {
      services: { where: { active: true }, orderBy: { name: 'asc' } },
      staffMembers: {
        where: { active: true },
        select: { id: true, name: true, services: true, photoUrl: true },
      },
    },
  })

  if (!salon) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 py-8 md:py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            ✨ {salon.name} ✨
          </h1>
          <p className="text-gray-600">Reserva tu cita en segundos</p>
          {salon.address && (
            <p className="text-sm text-gray-500 mt-1">📍 {salon.address}</p>
          )}
        </div>

        <BookingFlow
          salon={{
            id: salon.id,
            name: salon.name,
            slug: salon.slug,
            phone: salon.phone,
            address: salon.address,
          }}
          services={salon.services}
          staffMembers={salon.staffMembers}
        />
      </div>
    </div>
  )
}

