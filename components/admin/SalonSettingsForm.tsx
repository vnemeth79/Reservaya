'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

interface Salon {
  id: string
  name: string
  slug: string
  phone: string
  address: string | null
  ownerEmail: string
  subscriptionStatus: string
}

interface SalonSettingsFormProps {
  salon: Salon
}

export default function SalonSettingsForm({ salon }: SalonSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: salon.name,
    phone: salon.phone,
    address: salon.address || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/salon', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Configuración guardada exitosamente')
      } else {
        alert('Error al guardar la configuración')
      }
    } catch (error) {
      alert('Error al guardar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      TRIAL: 'bg-yellow-100 text-yellow-700',
      ACTIVE: 'bg-green-100 text-green-700',
      SUSPENDED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
    }
    const labels: Record<string, string> = {
      TRIAL: 'Prueba',
      ACTIVE: 'Activo',
      SUSPENDED: 'Suspendido',
      CANCELLED: 'Cancelado',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Información del Salón
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Salón</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label>URL Pública</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 text-sm bg-gray-100 px-4 py-2 rounded-lg border">
                {typeof window !== 'undefined' ? window.location.origin : 'https://reservaya.app'}/{salon.slug}
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Esta es la URL donde tus clientes pueden hacer reservas
            </p>
          </div>

          <Button
            type="submit"
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
                Guardar Cambios
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Suscripción
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Estado de tu suscripción</p>
            <div className="mt-2">
              {getStatusBadge(salon.subscriptionStatus)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

