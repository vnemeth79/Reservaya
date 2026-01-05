import Link from 'next/link'
import { Calendar, Clock, Users, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">ReservaYa</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-pink-600 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
            >
              Registrar Salón
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Reservas Online para tu
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            {' '}
            Salón de Belleza
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Permite a tus clientes reservar citas 24/7. Sin llamadas, sin esperas.
          Simple, rápido y profesional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro"
            className="px-8 py-4 bg-pink-500 text-white text-lg font-semibold rounded-full hover:bg-pink-600 transition shadow-lg hover:shadow-xl"
          >
            Comenzar Prueba Gratis
          </Link>
          <Link
            href="/salon-belleza-maria"
            className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-full hover:bg-gray-50 transition shadow-lg border"
          >
            Ver Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Todo lo que necesitas para gestionar tu salón
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Reservas 24/7
            </h3>
            <p className="text-gray-600">
              Tus clientes pueden reservar a cualquier hora del día, incluso cuando
              el salón está cerrado.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Recordatorios Automáticos
            </h3>
            <p className="text-gray-600">
              Envío automático de recordatorios por correo electrónico para
              reducir las ausencias.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Gestión de Personal
            </h3>
            <p className="text-gray-600">
              Cada profesional tiene su propia agenda y puede ver solo sus citas
              asignadas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para modernizar tu salón?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Únete a cientos de salones que ya usan ReservaYa para gestionar sus
            citas de forma profesional.
          </p>
          <Link
            href="/registro"
            className="inline-block px-8 py-4 bg-white text-pink-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition shadow-lg"
          >
            Empezar Ahora - Es Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <span className="text-xl font-bold text-gray-800">ReservaYa</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 ReservaYa. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

