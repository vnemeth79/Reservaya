import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import {
  addMinutes,
  format,
  startOfDay,
  addDays,
  setHours,
  setMinutes,
  isBefore,
} from 'date-fns'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const staffId = searchParams.get('staffId')
  const duration = parseInt(searchParams.get('duration') || '30')
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!staffId || !date) {
    return NextResponse.json(
      { error: 'Parámetros faltantes' },
      { status: 400 }
    )
  }

  try {
    // Get working hours for this staff on this day
    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay()

    const workingHours = await prisma.workingHours.findFirst({
      where: {
        staffId,
        dayOfWeek,
      },
    })

    if (!workingHours) {
      return NextResponse.json({ slots: [] })
    }

    // Get existing bookings for this day
    const startOfDayDate = startOfDay(requestedDate)
    const endOfDayDate = addDays(startOfDayDate, 1)

    const existingBookings = await prisma.booking.findMany({
      where: {
        staffId,
        bookingDatetime: {
          gte: startOfDayDate,
          lt: endOfDayDate,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      include: { service: true },
    })

    // Generate available slots
    const slots = generateTimeSlots(
      workingHours.startTime,
      workingHours.endTime,
      duration,
      existingBookings,
      date
    )

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error al cargar disponibilidad:', error)
    return NextResponse.json(
      { error: 'Error al cargar disponibilidad' },
      { status: 500 }
    )
  }
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  existingBookings: any[],
  date: string
): string[] {
  const slots: string[] = []
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  let current = new Date(date)
  current = setHours(setMinutes(current, startMin), startHour)

  const end = new Date(date)
  const endDate = setHours(setMinutes(end, endMin), endHour)

  const now = new Date()

  while (current < endDate) {
    const slotEnd = addMinutes(current, duration)

    // Skip past time slots for today
    if (isBefore(current, now)) {
      current = addMinutes(current, 30)
      continue
    }

    // Check if slot conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = new Date(booking.bookingDatetime)
      const bookingEnd = addMinutes(bookingStart, booking.service.durationMinutes)

      return (
        (current >= bookingStart && current < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (current <= bookingStart && slotEnd >= bookingEnd)
      )
    })

    if (!hasConflict && slotEnd <= endDate) {
      slots.push(format(current, 'HH:mm'))
    }

    current = addMinutes(current, 30) // 30 minute intervals
  }

  return slots
}

