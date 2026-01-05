'use client'

import { useState } from 'react'
import ServiceSelection from './ServiceSelection'
import StaffSelection from './StaffSelection'
import DateTimeSelection from './DateTimeSelection'
import CustomerForm from './CustomerForm'
import BookingSuccess from './BookingSuccess'

type Step = 1 | 2 | 3 | 4 | 5

interface Service {
  id: string
  name: string
  durationMinutes: number
  price: number | null
}

interface StaffMember {
  id: string
  name: string
  services: string[]
  photoUrl: string | null
}

interface Salon {
  id: string
  name: string
  slug: string
  phone: string
  address: string | null
}

interface BookingFlowProps {
  salon: Salon
  services: Service[]
  staffMembers: StaffMember[]
}

export default function BookingFlow({
  salon,
  services,
  staffMembers,
}: BookingFlowProps) {
  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)

  const handleBookingComplete = async (customerData: {
    name: string
    phone: string
    email: string
  }) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId: salon.id,
          staffId: selectedStaff!.id,
          serviceId: selectedService!.id,
          bookingDatetime: selectedDateTime,
          customerName: customerData.name,
          customerPhone: customerData.phone,
          customerEmail: customerData.email || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBookingData({
          ...data.booking,
          salon,
          service: selectedService,
          staff: selectedStaff,
        })
        setStep(5)
      } else {
        const error = await response.json()
        alert(error.error || 'No se pudo crear la reserva. Por favor intenta de nuevo.')
      }
    } catch (error) {
      alert('Error de conexión. Por favor intenta de nuevo.')
    }
  }

  const filteredStaff = selectedService
    ? staffMembers.filter((staff) =>
        staff.services.includes(selectedService.id)
      )
    : []

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Progress indicator */}
      {step < 5 && (
        <div className="flex justify-between mb-8 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                step >= i ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <ServiceSelection
          services={services}
          onSelect={(service) => {
            setSelectedService(service)
            setStep(2)
          }}
        />
      )}

      {step === 2 && (
        <StaffSelection
          staffMembers={filteredStaff}
          onSelect={(staff) => {
            setSelectedStaff(staff)
            setStep(3)
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <DateTimeSelection
          salonId={salon.id}
          staffId={selectedStaff!.id}
          serviceDuration={selectedService!.durationMinutes}
          onSelect={(datetime) => {
            setSelectedDateTime(datetime)
            setStep(4)
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <CustomerForm
          selectedService={selectedService!}
          selectedStaff={selectedStaff!}
          selectedDateTime={selectedDateTime!}
          onSubmit={handleBookingComplete}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && bookingData && (
        <BookingSuccess
          booking={bookingData}
          salonSlug={salon.slug}
        />
      )}
    </div>
  )
}

