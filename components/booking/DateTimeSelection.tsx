'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { es } from 'date-fns/locale'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { Loader2 } from 'lucide-react'

interface DateTimeSelectionProps {
  salonId: string
  staffId: string
  serviceDuration: number
  onSelect: (datetime: Date) => void
  onBack: () => void
}

export default function DateTimeSelection({
  salonId,
  staffId,
  serviceDuration,
  onSelect,
  onBack,
}: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      setLoading(true)
      fetch(
        `/api/availability?staffId=${staffId}&duration=${serviceDuration}&date=${format(selectedDate, 'yyyy-MM-dd')}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data.slots || [])
          setLoading(false)
        })
        .catch(() => {
          setAvailableSlots([])
          setLoading(false)
        })
    }
  }, [selectedDate, staffId, serviceDuration])

  const handleSlotSelect = (slot: string) => {
    if (!selectedDate) return
    const [hours, minutes] = slot.split(':').map(Number)
    const datetime = new Date(selectedDate)
    datetime.setHours(hours, minutes, 0, 0)
    onSelect(datetime)
  }

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 60) // Allow booking up to 60 days in advance

  // Group slots by time of day
  const groupedSlots = {
    mañana: availableSlots.filter((slot) => {
      const hour = parseInt(slot.split(':')[0])
      return hour < 12
    }),
    tarde: availableSlots.filter((slot) => {
      const hour = parseInt(slot.split(':')[0])
      return hour >= 12 && hour < 18
    }),
    noche: availableSlots.filter((slot) => {
      const hour = parseInt(slot.split(':')[0])
      return hour >= 18
    }),
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        3️⃣ Selecciona Fecha y Hora
      </h2>
      <p className="text-gray-600 mb-6">
        Escoge el día y horario de tu preferencia
      </p>

      <div className="flex justify-center mb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={es}
          disabled={(date) =>
            isBefore(date, today) || isBefore(maxDate, date) || date.getDay() === 0
          }
          className="rounded-lg border shadow-sm"
        />
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Horarios disponibles -{' '}
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
              <span className="ml-2 text-gray-600">Cargando disponibilidad...</span>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay horarios disponibles para este día</p>
              <p className="text-sm mt-1">Por favor selecciona otra fecha</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedSlots.mañana.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    🌅 Mañana
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {groupedSlots.mañana.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleSlotSelect(slot)}
                        className="p-2 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-sm font-medium"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groupedSlots.tarde.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    ☀️ Tarde
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {groupedSlots.tarde.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleSlotSelect(slot)}
                        className="p-2 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-sm font-medium"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groupedSlots.noche.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    🌙 Noche
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {groupedSlots.noche.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleSlotSelect(slot)}
                        className="p-2 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-sm font-medium"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          ← Volver
        </Button>
      </div>
    </div>
  )
}

