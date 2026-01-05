import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone')
  const name = searchParams.get('name')
  const salonSlug = searchParams.get('salonSlug')

  if (!phone || !name) {
    return NextResponse.json(
      { error: 'Teléfono y nombre son requeridos' },
      { status: 400 }
    )
  }

  try {
    // Clean phone number for comparison
    const cleanPhone = phone.replace(/\D/g, '')

    const salon = salonSlug
      ? await prisma.salon.findUnique({ where: { slug: salonSlug } })
      : null

    const bookings = await prisma.booking.findMany({
      where: {
        customerPhone: { contains: cleanPhone },
        customerName: { contains: name, mode: 'insensitive' },
        ...(salon && { salonId: salon.id }),
        bookingDatetime: { gte: new Date() },
      },
      include: {
        service: true,
        staff: true,
        salon: true,
      },
      orderBy: { bookingDatetime: 'asc' },
      take: 10,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error al buscar reservas:', error)
    return NextResponse.json(
      { error: 'Error al buscar reservas' },
      { status: 500 }
    )
  }
}

