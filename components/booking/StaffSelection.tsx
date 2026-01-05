'use client'

import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  services: string[]
  photoUrl: string | null
}

interface StaffSelectionProps {
  staffMembers: StaffMember[]
  onSelect: (staff: StaffMember) => void
  onBack: () => void
}

export default function StaffSelection({
  staffMembers,
  onSelect,
  onBack,
}: StaffSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        2️⃣ Elige tu Profesional
      </h2>
      <p className="text-gray-600 mb-6">Selecciona quién te atenderá</p>

      <div className="grid gap-3 mb-6">
        {staffMembers.map((staff) => (
          <button
            key={staff.id}
            onClick={() => onSelect(staff)}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition text-left flex items-center gap-4 group"
          >
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={staff.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <User className="w-7 h-7 text-pink-500" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 group-hover:text-pink-600">
                {staff.name}
              </h3>
              <p className="text-gray-500 text-sm">Disponible</p>
            </div>
          </button>
        ))}
      </div>

      {staffMembers.length === 0 && (
        <p className="text-center text-gray-500 py-8 mb-6">
          No hay profesionales disponibles para este servicio
        </p>
      )}

      <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
        ← Volver
      </Button>
    </div>
  )
}

