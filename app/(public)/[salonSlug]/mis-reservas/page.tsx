'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, User, Scissors, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: string
  bookingDatetime: string
  status: string
  customerName: string
  customerPhone: string
  service: { name: string; durationMinutes: number }
  staff: { name: string }
}

export default function MisReservasPage({
  params,
}: {
  params: { salonSlug: string }
}) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(
        `/api/bookings/search?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&salonSlug=${params.salonSlug}`
      )
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error al buscar reservas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) return

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== bookingId))
        alert('Cita cancelada exitosamente')
      } else {
        alert('No se pudo cancelar la cita')
      }
    } catch (error) {
      alert('Error al cancelar la cita')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      NO_SHOW: 'bg-gray-100 text-gray-700',
    }
    const labels: Record<string, string> = {
      CONFIRMED: 'Confirmada',
      CANCELLED: 'Cancelada',
      COMPLETED: 'Completada',
      NO_SHOW: 'No asistió',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Link
          href={`/${params.salonSlug}`}
          className="inline-flex items-center text-gray-600 hover:text-pink-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a reservar
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Reservas</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <p className="text-gray-600 mb-6">
            Ingresa tus datos para ver y gestionar tus reservas
          </p>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+506 1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar Mis Reservas'}
            </Button>
          </form>
        </div>

        {searched && (
          <>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tus Citas ({bookings.length})
                </h2>
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                          <Calendar className="w-5 h-5 text-pink-500" />
                          {format(
                            new Date(booking.bookingDatetime),
                            "EEEE, d 'de' MMMM",
                            { locale: es }
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(booking.bookingDatetime), 'HH:mm')} hrs
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4" />
                        <span>
                          {booking.service.name} ({booking.service.durationMinutes}{' '}
                          min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Con {booking.staff.name}</span>
                      </div>
                    </div>

                    {booking.status === 'CONFIRMED' && (
                      <div className="mt-4 pt-4 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancelar Cita
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">
                  No se encontraron reservas con estos datos
                </p>
                <Link
                  href={`/${params.salonSlug}`}
                  className="inline-block mt-4 text-pink-500 hover:text-pink-600"
                >
                  Hacer una nueva reserva →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

