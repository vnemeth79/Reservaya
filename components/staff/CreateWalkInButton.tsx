'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface CreateWalkInButtonProps {
  staffId: string
  salonId: string
  services: { id: string; name: string; durationMinutes: number }[]
}

export default function CreateWalkInButton({
  staffId,
  salonId,
  services,
}: CreateWalkInButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceId: '',
    time: format(new Date(), 'HH:mm'),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serviceId) {
      alert('Por favor selecciona un servicio')
      return
    }

    setLoading(true)

    try {
      const [hours, minutes] = formData.time.split(':').map(Number)
      const bookingDatetime = new Date()
      bookingDatetime.setHours(hours, minutes, 0, 0)

      const response = await fetch('/api/staff/walk-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          staffId,
          serviceId: formData.serviceId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          bookingDatetime,
        }),
      })

      if (response.ok) {
        alert('Cliente registrado exitosamente')
        setOpen(false)
        setFormData({
          customerName: '',
          customerPhone: '',
          serviceId: '',
          time: format(new Date(), 'HH:mm'),
        })
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al registrar cliente')
      }
    } catch (error) {
      alert('Error al registrar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Walk-in
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Cliente sin Cita</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Nombre del Cliente *</Label>
            <Input
              id="customerName"
              placeholder="Ej: María González"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Teléfono *</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="+506 8888-8888"
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="service">Servicio *</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData({ ...formData, serviceId: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.durationMinutes} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time">Hora *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              'Crear Cita'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

