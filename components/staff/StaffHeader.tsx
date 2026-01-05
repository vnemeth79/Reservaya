'use client'

import { signOut } from 'next-auth/react'
import { LogOut, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StaffHeaderProps {
  staffMember: any
  salonName: string
}

export default function StaffHeader({ staffMember, salonName }: StaffHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-4xl">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{salonName}</h1>
          <p className="text-sm text-gray-600">Mi Agenda</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Panel Admin</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

