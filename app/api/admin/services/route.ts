import { prisma } from '@/lib/db'
import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])
    const body = await req.json()
    const { name, durationMinutes, price, salonId } = body

    if (!name || !durationMinutes) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        salonId: salonId || user.salonId!,
        name,
        durationMinutes,
        price: price || null,
        active: true,
      },
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Error al crear servicio:', error)
    return NextResponse.json(
      { error: 'No se pudo agregar el servicio' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

    const services = await prisma.service.findMany({
      where: getSalonFilter(user),
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    )
  }
}

