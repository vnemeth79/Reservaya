'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

interface WorkingHour {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface WorkingHoursFormProps {
  staffId: string
  workingHours: WorkingHour[]
  daysOfWeek: { value: number; label: string }[]
}

export default function WorkingHoursForm({
  staffId,
  workingHours,
  daysOfWeek,
}: WorkingHoursFormProps) {
  const [loading, setLoading] = useState(false)
  const [hours, setHours] = useState<Record<number, { enabled: boolean; start: string; end: string }>>(
    () => {
      const initial: Record<number, { enabled: boolean; start: string; end: string }> = {}
      daysOfWeek.forEach((day) => {
        const existing = workingHours.find((wh) => wh.dayOfWeek === day.value)
        initial[day.value] = {
          enabled: !!existing,
          start: existing?.startTime || '09:00',
          end: existing?.endTime || '18:00',
        }
      })
      return initial
    }
  )

  const handleSave = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          hours: Object.entries(hours)
            .filter(([_, data]) => data.enabled)
            .map(([day, data]) => ({
              dayOfWeek: parseInt(day),
              startTime: data.start,
              endTime: data.end,
            })),
        }),
      })

      if (response.ok) {
        alert('Horarios guardados exitosamente')
      } else {
        alert('Error al guardar los horarios')
      }
    } catch (error) {
      alert('Error al guardar los horarios')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => (
        <div
          key={day.value}
          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
        >
          <div className="w-32 flex items-center gap-2">
            <Checkbox
              id={`day-${day.value}`}
              checked={hours[day.value].enabled}
              onCheckedChange={(checked) =>
                setHours({
                  ...hours,
                  [day.value]: { ...hours[day.value], enabled: checked as boolean },
                })
              }
            />
            <Label
              htmlFor={`day-${day.value}`}
              className="font-medium cursor-pointer"
            >
              {day.label}
            </Label>
          </div>

          {hours[day.value].enabled ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="time"
                value={hours[day.value].start}
                onChange={(e) =>
                  setHours({
                    ...hours,
                    [day.value]: { ...hours[day.value], start: e.target.value },
                  })
                }
                className="w-32"
              />
              <span className="text-gray-500">a</span>
              <Input
                type="time"
                value={hours[day.value].end}
                onChange={(e) =>
                  setHours({
                    ...hours,
                    [day.value]: { ...hours[day.value], end: e.target.value },
                  })
                }
                className="w-32"
              />
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Cerrado</span>
          )}
        </div>
      ))}

      <Button
        onClick={handleSave}
        disabled={loading}
        className="bg-pink-500 hover:bg-pink-600"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Guardar Horarios
          </>
        )}
      </Button>
    </div>
  )
}

