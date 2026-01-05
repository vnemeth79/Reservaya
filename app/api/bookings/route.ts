import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendBookingConfirmation, sendStaffNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      salonId,
      staffId,
      serviceId,
      bookingDatetime,
      customerName,
      customerPhone,
      customerEmail,
    } = body

    // Validation
    if (
      !salonId ||
      !staffId ||
      !serviceId ||
      !bookingDatetime ||
      !customerName ||
      !customerPhone
    ) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Check if the slot is still available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        staffId,
        bookingDatetime: new Date(bookingDatetime),
        status: 'CONFIRMED',
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Este horario ya no está disponible. Por favor selecciona otro.' },
        { status: 409 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        salonId,
        staffId,
        serviceId,
        bookingDatetime: new Date(bookingDatetime),
        customerName,
        customerPhone,
        customerEmail,
        status: 'CONFIRMED',
      },
      include: {
        salon: true,
        staff: { include: { user: true } },
        service: true,
      },
    })

    // Send emails (don't await to not block the response)
    if (customerEmail) {
      sendBookingConfirmation({
        customerEmail,
        customerName,
        booking,
        salon: booking.salon,
        staff: booking.staff,
        service: booking.service,
      }).catch(console.error)
    }

    if (booking.staff.user?.email) {
      sendStaffNotification({
        staffEmail: booking.staff.user.email,
        staffName: booking.staff.name,
        booking,
        customerName,
        service: booking.service,
      }).catch(console.error)
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Error al crear reserva:', error)
    return NextResponse.json(
      { error: 'No se pudo crear la reserva. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const salonId = searchParams.get('salonId')
  const staffId = searchParams.get('staffId')
  const date = searchParams.get('date')

  try {
    const whereClause: any = {}

    if (salonId) whereClause.salonId = salonId
    if (staffId) whereClause.staffId = staffId
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      whereClause.bookingDatetime = {
        gte: startDate,
        lte: endDate,
      }
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        service: true,
        staff: true,
      },
      orderBy: { bookingDatetime: 'asc' },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    )
  }
}

