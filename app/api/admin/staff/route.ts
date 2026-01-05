import { prisma } from '@/lib/db'
import { requireAuth, getSalonFilter } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { sendStaffInvitation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])
    const body = await req.json()
    const { name, email, services, salonId } = body

    if (!name || !email || !services || services.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este correo electrónico' },
        { status: 400 }
      )
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await hash(tempPassword, 10)

    // Create staff member
    const staffMember = await prisma.staffMember.create({
      data: {
        salonId: salonId || user.salonId!,
        name,
        services,
        active: true,
      },
    })

    // Create user account
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SALON_STAFF',
        salonId: salonId || user.salonId!,
        staffMemberId: staffMember.id,
      },
    })

    // Send invitation email
    const salon = await prisma.salon.findUnique({
      where: { id: salonId || user.salonId! },
    })

    sendStaffInvitation({
      staffEmail: email,
      staffName: name,
      salonName: salon!.name,
      tempPassword,
    }).catch(console.error)

    return NextResponse.json({ staffMember }, { status: 201 })
  } catch (error) {
    console.error('Error al crear personal:', error)
    return NextResponse.json(
      { error: 'No se pudo agregar el personal' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(['SALON_OWNER', 'SUPER_ADMIN'])

    const staff = await prisma.staffMember.findMany({
      where: getSalonFilter(user),
      include: {
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error('Error al obtener personal:', error)
    return NextResponse.json(
      { error: 'Error al obtener personal' },
      { status: 500 }
    )
  }
}

