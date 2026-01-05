'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, Scissors, User, Loader2 } from 'lucide-react'

interface CustomerFormProps {
  selectedService: { name: string; durationMinutes: number; price: number | null }
  selectedStaff: { name: string }
  selectedDateTime: Date
  onSubmit: (data: { name: string; phone: string; email: string }) => Promise<void>
  onBack: () => void
}

export default function CustomerForm({
  selectedService,
  selectedStaff,
  selectedDateTime,
  onSubmit,
  onBack,
}: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePhone = (phone: string) => {
    // Costa Rica phone format: +506 XXXX-XXXX or 8 digits
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 8
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Número de teléfono inválido'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})
    await onSubmit(formData)
    setLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        4️⃣ Tus Datos
      </h2>
      <p className="text-gray-600 mb-6">
        Completa tu información para confirmar la reserva
      </p>

      {/* Booking Summary */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Resumen de tu cita</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Scissors className="w-4 h-4 text-pink-500" />
            <span>
              {selectedService.name}
              {selectedService.price && ` - ${formatPrice(selectedService.price)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-pink-500" />
            <span>Con {selectedStaff.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-pink-500" />
            <span>
              {format(selectedDateTime, "EEEE, d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-pink-500" />
            <span>{format(selectedDateTime, 'HH:mm')} hrs</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            placeholder="Ej: María González"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+506 8888-8888"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Correo Electrónico (opcional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Recibirás confirmación y recordatorios por correo
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={loading}
          >
            ← Volver
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-pink-500 hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              '✓ Confirmar Reserva'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

