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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Loader2 } from 'lucide-react'

interface AddStaffButtonProps {
  services: { id: string; name: string }[]
  salonId: string
}

export default function AddStaffButton({ services, salonId }: AddStaffButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    services: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.services.length === 0) {
      alert('Debes seleccionar al menos un servicio')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, salonId }),
      })

      if (response.ok) {
        alert('Personal agregado exitosamente. Se ha enviado un correo con las credenciales de acceso.')
        setOpen(false)
        setFormData({ name: '', email: '', services: [] })
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al agregar personal')
      }
    } catch (error) {
      alert('Error al agregar personal')
    } finally {
      setLoading(false)
    }
  }

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceId],
      })
    } else {
      setFormData({
        ...formData,
        services: formData.services.filter((id) => id !== serviceId),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Personal
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Personal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              placeholder="Ej: Carmen Martínez"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="carmen@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se enviará un correo con las credenciales de acceso
            </p>
          </div>

          <div>
            <Label>Servicios que Ofrece *</Label>
            <div className="space-y-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.services.includes(service.id)}
                    onCheckedChange={(checked) =>
                      handleServiceToggle(service.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={service.id} className="font-normal cursor-pointer">
                    {service.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Agregando...
              </>
            ) : (
              'Agregar Personal'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

