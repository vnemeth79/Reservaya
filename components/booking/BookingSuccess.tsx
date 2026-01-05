'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, Calendar, Clock, User, Scissors, Phone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BookingSuccessProps {
  booking: {
    id: string
    bookingDatetime: string
    customerName: string
    customerPhone: string
    salon: { name: string; phone: string; address: string | null }
    service: { name: string; durationMinutes: number }
    staff: { name: string }
  }
  salonSlug: string
}

export default function BookingSuccess({ booking, salonSlug }: BookingSuccessProps) {
  const bookingDate = new Date(booking.bookingDatetime)

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        ¡Cita Confirmada!
      </h2>
      <p className="text-gray-600 mb-8">
        Tu reserva ha sido creada exitosamente
      </p>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6 text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-pink-500" />
            <div>
              <p className="font-semibold text-gray-800">
                {format(bookingDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-pink-500" />
            <span className="text-gray-700">
              {format(bookingDate, 'HH:mm')} hrs
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-pink-500" />
            <span className="text-gray-700">
              {booking.service.name} ({booking.service.durationMinutes} min)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-pink-500" />
            <span className="text-gray-700">Con {booking.staff.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-pink-500" />
            <span className="text-gray-700">{booking.salon.phone}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm text-blue-700">
          📧 Si proporcionaste tu correo electrónico, recibirás una confirmación
          con los detalles de tu cita y un archivo de calendario.
        </p>
      </div>

      <div className="space-y-3">
        <Link href={`/${salonSlug}/mis-reservas`}>
          <Button variant="outline" className="w-full">
            Ver Mis Reservas
          </Button>
        </Link>

        <Link href={`/${salonSlug}`}>
          <Button className="w-full bg-pink-500 hover:bg-pink-600">
            Hacer Otra Reserva
          </Button>
        </Link>
      </div>
    </div>
  )
}

