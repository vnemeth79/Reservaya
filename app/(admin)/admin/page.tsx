import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  const today = new Date()
  const salonFilter = getSalonFilter(user)

  const todayBookings = await prisma.booking.count({
    where: {
      ...salonFilter,
      bookingDatetime: {
        gte: startOfDay(today),
        lt: endOfDay(today),
      },
      status: 'CONFIRMED',
    },
  })

  const tomorrowBookings = await prisma.booking.count({
    where: {
      ...salonFilter,
      bookingDatetime: {
        gte: startOfDay(addDays(today, 1)),
        lt: endOfDay(addDays(today, 1)),
      },
      status: 'CONFIRMED',
    },
  })

  const activeStaff = await prisma.staffMember.count({
    where: {
      ...salonFilter,
      active: true,
    },
  })

  const completedToday = await prisma.booking.count({
    where: {
      ...salonFilter,
      bookingDatetime: {
        gte: startOfDay(today),
        lt: endOfDay(today),
      },
      status: 'COMPLETED',
    },
  })

  const todayBookingsList = await prisma.booking.findMany({
    where: {
      ...salonFilter,
      bookingDatetime: {
        gte: startOfDay(today),
        lt: endOfDay(today),
      },
      status: { not: 'CANCELLED' },
    },
    include: {
      staff: true,
      service: true,
    },
    orderBy: { bookingDatetime: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-1">
          {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Reservas Hoy</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {todayBookings}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Reservas Mañana
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {tomorrowBookings}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Completadas Hoy
              </p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {completedToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Personal Activo
              </p>
              <p className="text-3xl font-bold text-pink-600 mt-1">
                {activeStaff}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Agenda de Hoy
          </h2>
          <Link
            href="/admin/calendario"
            className="text-pink-500 hover:text-pink-600 text-sm font-medium"
          >
            Ver calendario completo →
          </Link>
        </div>

        {todayBookingsList.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay reservas programadas para hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayBookingsList.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-800">
                      {format(new Date(booking.bookingDatetime), 'HH:mm')}
                    </span>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.service.name} • {booking.staff.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {booking.status === 'CONFIRMED' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Confirmada
                    </span>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Completada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

