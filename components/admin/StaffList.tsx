'use client'

import { useState } from 'react'
import { Edit, Trash2, Mail, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StaffMember {
  id: string
  name: string
  services: string[]
  photoUrl: string | null
  active: boolean
  user: { email: string } | null
}

interface StaffListProps {
  staff: StaffMember[]
  services: { id: string; name: string }[]
}

export default function StaffList({ staff, services }: StaffListProps) {
  const [staffList, setStaffList] = useState(staff)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este personal? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setStaffList(staffList.filter((s) => s.id !== id))
      } else {
        alert('Error al eliminar el personal')
      }
    } catch (error) {
      alert('Error al eliminar el personal')
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (response.ok) {
        setStaffList(
          staffList.map((s) =>
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

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds
      .map((id) => services.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  return (
    <div className="grid gap-4">
      {staffList.map((member) => (
        <div
          key={member.id}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-2xl">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>

                {member.user?.email && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{member.user.email}</span>
                  </div>
                )}

                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Servicios:</span>{' '}
                    {getServiceNames(member.services) || 'Sin servicios asignados'}
                  </p>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      member.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {member.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleActive(member.id, member.active)}
                title={member.active ? 'Desactivar' : 'Activar'}
              >
                {member.active ? (
                  <ToggleRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(member.id)}
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

