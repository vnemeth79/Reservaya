import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])
    const body = await req.json()

    const service = await prisma.service.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Error al actualizar servicio:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el servicio' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

    await prisma.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el servicio' },
      { status: 500 }
    )
  }
}

