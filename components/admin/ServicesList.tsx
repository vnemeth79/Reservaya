'use client'

import { useState } from 'react'
import { Trash2, ToggleLeft, ToggleRight, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  name: string
  durationMinutes: number
  price: number | null
  active: boolean
}

interface ServicesListProps {
  services: Service[]
}

export default function ServicesList({ services }: ServicesListProps) {
  const [serviceList, setServiceList] = useState(services)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setServiceList(serviceList.filter((s) => s.id !== id))
      } else {
        alert('Error al eliminar el servicio')
      }
    } catch (error) {
      alert('Error al eliminar el servicio')
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (response.ok) {
        setServiceList(
          serviceList.map((s) =>
            s.id === id ? { ...s, active: !currentActive } : s
          )
        )
      } else {
        alert('Error al actualizar el estado')
      }
    } catch (error) {
      alert('Error al actualizar el estado')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid gap-4">
      {serviceList.map((service) => (
        <div
          key={service.id}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">
                {service.name}
              </h3>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.durationMinutes} minutos</span>
                </div>
                {service.price && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatPrice(service.price)}</span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    service.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {service.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleActive(service.id, service.active)}
                title={service.active ? 'Desactivar' : 'Activar'}
              >
                {service.active ? (
                  <ToggleRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(service.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

