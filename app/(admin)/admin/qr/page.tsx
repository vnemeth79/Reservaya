'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Download, Copy, Check, Printer } from 'lucide-react'

export default function QRCodePage() {
  const { data: session } = useSession()
  const [qrCode, setQRCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const salonSlug = (session?.user as any)?.salonSlug

  useEffect(() => {
    if (salonSlug) {
      fetch(`/api/qr?slug=${salonSlug}`)
        .then((res) => res.json())
        .then((data) => setQRCode(data.qrCode))
        .catch(console.error)
    }
  }, [salonSlug])

  const handleDownload = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'codigo-qr-reservas.png'
    link.click()
  }

  const handleCopy = () => {
    const url = `${window.location.origin}/${salonSlug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const bookingUrl = typeof window !== 'undefined' && salonSlug
    ? `${window.location.origin}/${salonSlug}` 
    : 'Cargando...'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Código QR para Reservas</h1>
        <p className="text-gray-600 mt-1">
          Comparte este código para que tus clientes reserven fácilmente
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tu Código QR
          </h2>

          {qrCode ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-xl border-4 border-pink-500 mb-6">
                <img src={qrCode} alt="Código QR" className="w-64 h-64" />
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                <Button onClick={handleDownload} className="bg-pink-500 hover:bg-pink-600">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PNG
                </Button>

                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">URL de Reservas</h3>
            <div className="flex gap-2">
              <code className="flex-1 text-sm bg-gray-100 px-4 py-3 rounded-lg border overflow-hidden text-ellipsis">
                {bookingUrl}
              </code>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Descarga o imprime el código QR en tamaño A4</li>
              <li>Colócalo en un lugar visible de tu salón</li>
              <li>Los clientes pueden escanearlo con su celular para reservar</li>
              <li>También puedes compartir la URL en redes sociales</li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
            <h3 className="font-semibold text-pink-800 mb-2">💡 Consejo</h3>
            <p className="text-sm text-pink-700">
              Coloca el código QR cerca de la entrada o en el área de espera para
              que los clientes puedan agendar fácilmente su próxima cita antes de
              salir del salón.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

