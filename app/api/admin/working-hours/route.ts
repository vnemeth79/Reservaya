import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])
    const body = await req.json()
    const { staffId, hours } = body

    if (!staffId || !hours) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Get staff member to get salonId
    const staff = await prisma.staffMember.findUnique({
      where: { id: staffId },
    })

    if (!staff) {
      return NextResponse.json(
        { error: 'Personal no encontrado' },
        { status: 404 }
      )
    }

    // Delete existing working hours for this staff
    await prisma.workingHours.deleteMany({
      where: { staffId },
    })

    // Create new working hours
    if (hours.length > 0) {
      await prisma.workingHours.createMany({
        data: hours.map((h: any) => ({
          salonId: staff.salonId,
          staffId,
          dayOfWeek: h.dayOfWeek,
          startTime: h.startTime,
          endTime: h.endTime,
        })),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al actualizar horarios:', error)
    return NextResponse.json(
      { error: 'Error al actualizar los horarios' },
      { status: 500 }
    )
  }
}

