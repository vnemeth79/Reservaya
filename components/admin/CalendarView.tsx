'use client'

import { format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

interface Booking {
  id: string
  bookingDatetime: string
  customerName: string
  status: string
  staff: { id: string; name: string }
  service: { name: string; durationMinutes: number }
}

interface StaffMember {
  id: string
  name: string
}

interface CalendarViewProps {
  bookings: Booking[]
  staffMembers: StaffMember[]
  weekDays: Date[]
}

export default function CalendarView({
  bookings,
  staffMembers,
  weekDays,
}: CalendarViewProps) {
  const getBookingsForDayAndStaff = (day: Date, staffId: string) => {
    return bookings.filter(
      (booking) =>
        isSameDay(new Date(booking.bookingDatetime), day) &&
        booking.staff.id === staffId
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 border-blue-300 text-blue-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const isToday = (day: Date) => isSameDay(day, new Date())

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left font-semibold text-gray-700 border-b w-32">
                Personal
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toISOString()}
                  className={`p-4 text-center border-b ${
                    isToday(day) ? 'bg-pink-50' : ''
                  }`}
                >
                  <div
                    className={`font-semibold ${
                      isToday(day) ? 'text-pink-600' : 'text-gray-700'
                    }`}
                  >
                    {format(day, 'EEE', { locale: es })}
                  </div>
                  <div
                    className={`text-sm ${
                      isToday(day) ? 'text-pink-500' : 'text-gray-500'
                    }`}
                  >
                    {format(day, 'd MMM', { locale: es })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-sm">
                      {staff.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-[100px]">{staff.name}</span>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const dayBookings = getBookingsForDayAndStaff(day, staff.id)
                  return (
                    <td
                      key={`${staff.id}-${day.toISOString()}`}
                      className={`p-2 align-top min-h-[100px] ${
                        isToday(day) ? 'bg-pink-50/50' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        {dayBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className={`p-2 rounded border text-xs ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            <div className="font-semibold">
                              {format(new Date(booking.bookingDatetime), 'HH:mm')}
                            </div>
                            <div className="truncate">{booking.customerName}</div>
                            <div className="text-xs opacity-75 truncate">
                              {booking.service.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staffMembers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay personal registrado
        </div>
      )}
    </div>
  )
}

