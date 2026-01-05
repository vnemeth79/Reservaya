'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  Users,
  Scissors,
  Clock,
  Settings,
  QrCode,
  Home,
  ExternalLink,
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Inicio', icon: Home },
  { href: '/admin/calendario', label: 'Calendario', icon: Calendar },
  { href: '/admin/personal', label: 'Personal', icon: Users },
  { href: '/admin/servicios', label: 'Servicios', icon: Scissors },
  { href: '/admin/horarios', label: 'Horarios', icon: Clock },
  { href: '/admin/qr', label: 'Código QR', icon: QrCode },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

interface AdminSidebarProps {
  salonSlug?: string | null
}

export default function AdminSidebar({ salonSlug }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] hidden md:block">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}

        {salonSlug && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              href={`/${salonSlug}`}
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">Ver Página Pública</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  )
}

