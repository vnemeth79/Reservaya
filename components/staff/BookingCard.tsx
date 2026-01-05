'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Phone, Clock, Scissors, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingCardProps {
  booking: {
    id: string
    bookingDatetime: string
    customerName: string
    customerPhone: string
    status: string
    service: { name: string; durationMinutes: number }
    staff: { name: string }
  }
}

export default function BookingCard({ booking }: BookingCardProps) {
  const [status, setStatus] = useState(booking.status)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'CANCELLED' && !confirm('¿Estás seguro de cancelar esta cita?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setStatus(newStatus)
      } else {
        alert('Error al actualizar la cita')
      }
    } catch (error) {
      alert('Error al actualizar la cita')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Confirmada
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Completada
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Cancelada
          </span>
        )
      case 'NO_SHOW':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            No asistió
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-pink-500" />
            <span className="font-bold text-xl text-gray-800">
              {format(new Date(booking.bookingDatetime), 'HH:mm')}
            </span>
            {getStatusBadge()}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {booking.customerName}
          </h3>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              <span>
                {booking.service.name} ({booking.service.durationMinutes} min)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a
                href={`tel:${booking.customerPhone}`}
                className="text-pink-500 hover:underline"
              >
                {booking.customerPhone}
              </a>
            </div>
          </div>
        </div>

        {status === 'CONFIRMED' && (
          <div className="flex sm:flex-col gap-2">
            <Button
              size="sm"
              onClick={() => handleStatusChange('COMPLETED')}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              <Check className="w-4 h-4 mr-1" />
              Completar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusChange('CANCELLED')}
              disabled={loading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

