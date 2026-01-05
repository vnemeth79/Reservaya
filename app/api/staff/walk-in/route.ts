import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SALON_STAFF', 'SALON_OWNER', 'SUPER_ADMIN'])
    const body = await req.json()
    const { salonId, staffId, serviceId, customerName, customerPhone, bookingDatetime } =
      body

    if (!salonId || !staffId || !serviceId || !customerName || !customerPhone || !bookingDatetime) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        salonId,
        staffId,
        serviceId,
        customerName,
        customerPhone,
        bookingDatetime: new Date(bookingDatetime),
        status: 'CONFIRMED',
      },
      include: {
        service: true,
        staff: true,
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Error al crear walk-in:', error)
    return NextResponse.json(
      { error: 'No se pudo crear la cita' },
      { status: 500 }
    )
  }
}

