import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])
    const body = await req.json()
    const { name, phone, address } = body

    if (!user.salonId) {
      return NextResponse.json(
        { error: 'Salón no encontrado' },
        { status: 404 }
      )
    }

    const salon = await prisma.salon.update({
      where: { id: user.salonId },
      data: { name, phone, address },
    })

    return NextResponse.json({ salon })
  } catch (error) {
    console.error('Error al actualizar salón:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el salón' },
      { status: 500 }
    )
  }
}

