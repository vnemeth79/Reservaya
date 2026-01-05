'use client'

interface Service {
  id: string
  name: string
  durationMinutes: number
  price: number | null
}

interface ServiceSelectionProps {
  services: Service[]
  onSelect: (service: Service) => void
}

export default function ServiceSelection({
  services,
  onSelect,
}: ServiceSelectionProps) {
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
        1️⃣ Selecciona el Servicio
      </h2>
      <p className="text-gray-600 mb-6">Elige el servicio que necesitas</p>

      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition text-left group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-pink-600">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  ⏱️ {service.durationMinutes} minutos
                </p>
              </div>
              {service.price && (
                <span className="text-pink-600 font-semibold">
                  {formatPrice(service.price)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {services.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No hay servicios disponibles en este momento
        </p>
      )}
    </div>
  )
}

