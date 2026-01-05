import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendCancellationEmail } from '@/lib/email'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status } = body

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
      include: {
        salon: true,
        staff: true,
        service: true,
      },
    })

    // Send cancellation email if cancelled
    if (status === 'CANCELLED' && booking.customerEmail) {
      sendCancellationEmail({
        customerEmail: booking.customerEmail,
        customerName: booking.customerName,
        booking,
        salon: booking.salon,
        staff: booking.staff,
        service: booking.service,
      }).catch(console.error)
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error al actualizar reserva:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la reserva' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar reserva:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la reserva' },
      { status: 500 }
    )
  }
}

