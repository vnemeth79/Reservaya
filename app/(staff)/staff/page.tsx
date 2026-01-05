import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import BookingCard from '@/components/staff/BookingCard'
import CreateWalkInButton from '@/components/staff/CreateWalkInButton'

export default async function StaffDashboard() {
  const user = await requireAuth(['SALON_STAFF', 'SALON_OWNER', 'SUPER_ADMIN'])

  const today = new Date()

  // For staff, show only their bookings; for owners, show all
  const staffFilter = user.staffMemberId
    ? { staffId: user.staffMemberId }
    : { salonId: user.salonId }

  const todayBookings = await prisma.booking.findMany({
    where: {
      ...staffFilter,
      bookingDatetime: {
        gte: startOfDay(today),
        lt: endOfDay(today),
      },
      status: { not: 'CANCELLED' },
    },
    include: {
      service: true,
      staff: true,
    },
    orderBy: { bookingDatetime: 'asc' },
  })

  const upcomingBookings = await prisma.booking.findMany({
    where: {
      ...staffFilter,
      bookingDatetime: {
        gte: endOfDay(today),
        lt: endOfDay(addDays(today, 7)),
      },
      status: { not: 'CANCELLED' },
    },
    include: {
      service: true,
      staff: true,
    },
    orderBy: { bookingDatetime: 'asc' },
    take: 5,
  })

  const staffMember = user.staffMemberId
    ? await prisma.staffMember.findUnique({
        where: { id: user.staffMemberId },
        include: {
          salon: {
            include: {
              services: { where: { active: true } },
            },
          },
        },
      })
    : null

  const services = staffMember?.salon.services || 
    (user.salonId 
      ? await prisma.service.findMany({ 
          where: { salonId: user.salonId, active: true } 
        }) 
      : [])

  const staffName = staffMember?.name.split(' ')[0] || 'Usuario'

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            ¡Hola, {staffName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
        {user.staffMemberId && (
          <CreateWalkInButton
            staffId={user.staffMemberId}
            salonId={staffMember?.salonId || user.salonId!}
            services={services}
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tus Citas de Hoy ({todayBookings.length})
        </h2>

        {todayBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-500">No tienes citas programadas para hoy</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {upcomingBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Próximas Citas
          </h2>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {format(
                        new Date(booking.bookingDatetime),
                        "EEEE, d 'de' MMMM",
                        { locale: es }
                      )}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {format(new Date(booking.bookingDatetime), 'HH:mm')} -{' '}
                      {booking.customerName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {booking.service.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Próxima
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

