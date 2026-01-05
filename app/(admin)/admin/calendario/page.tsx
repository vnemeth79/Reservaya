import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import CalendarView from '@/components/admin/CalendarView'

export const metadata = {
  title: 'Calendario | ReservaYa',
}

export default async function CalendarioPage() {
  const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  const bookings = await prisma.booking.findMany({
    where: {
      ...getSalonFilter(user),
      bookingDatetime: {
        gte: weekStart,
        lte: weekEnd,
      },
      status: { not: 'CANCELLED' },
    },
    include: {
      staff: true,
      service: true,
    },
    orderBy: { bookingDatetime: 'asc' },
  })

  const staffMembers = await prisma.staffMember.findMany({
    where: { ...getSalonFilter(user), active: true },
    orderBy: { name: 'asc' },
  })

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Calendario de Reservas</h1>
        <p className="text-gray-600 mt-1">
          Semana del {format(weekStart, "d 'de' MMMM", { locale: es })} al{' '}
          {format(weekEnd, "d 'de' MMMM", { locale: es })}
        </p>
      </div>

      <CalendarView
        bookings={bookings}
        staffMembers={staffMembers}
        weekDays={weekDays}
      />
    </div>
  )
}

