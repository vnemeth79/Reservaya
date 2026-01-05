import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-pink-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Página No Encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}

