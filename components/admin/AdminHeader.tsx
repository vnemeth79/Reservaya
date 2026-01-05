'use client'

import { signOut } from 'next-auth/react'
import { LogOut, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  user: any
  salonName: string
}

export default function AdminHeader({ user, salonName }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">{salonName}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.email}</p>
              <p className="text-xs text-gray-500">
                {user.role === 'SALON_OWNER' ? 'Administrador' : 'Super Admin'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

