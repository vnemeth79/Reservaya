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

    const staffMember = await prisma.staffMember.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ staffMember })
  } catch (error) {
    console.error('Error al actualizar personal:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el personal' },
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

    // Delete associated user first
    await prisma.user.deleteMany({
      where: { staffMemberId: params.id },
    })

    // Delete working hours
    await prisma.workingHours.deleteMany({
      where: { staffId: params.id },
    })

    // Delete staff member
    await prisma.staffMember.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar personal:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el personal' },
      { status: 500 }
    )
  }
}

