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
import { Plus, Loader2 } from 'lucide-react'

interface AddServiceButtonProps {
  salonId: string
}

export default function AddServiceButton({ salonId }: AddServiceButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    durationMinutes: 30,
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salonId,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ name: '', durationMinutes: 30, price: '' })
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al agregar servicio')
      }
    } catch (error) {
      alert('Error al agregar servicio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Servicio
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Servicio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Servicio *</Label>
            <Input
              id="name"
              placeholder="Ej: Corte de Cabello Mujer"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duración (minutos) *</Label>
            <Input
              id="duration"
              type="number"
              min="5"
              step="5"
              placeholder="30"
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationMinutes: parseInt(e.target.value) || 30,
                })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="price">Precio (opcional)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="100"
              placeholder="15000"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deja en blanco si no quieres mostrar el precio
            </p>
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
              'Agregar Servicio'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

