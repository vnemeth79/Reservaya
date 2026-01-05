import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear Salon
  const salon = await prisma.salon.create({
    data: {
      name: 'Salón Belleza María',
      slug: 'salon-belleza-maria',
      phone: '+506 2234-5678',
      address: 'Avenida Central 123, San José, Costa Rica',
      ownerEmail: 'maria@salonbelleza.com',
      subscriptionStatus: 'ACTIVE',
    },
  })

  console.log('✅ Salón creado:', salon.name)

  // Crear Servicios
  const services = await Promise.all([
    prisma.service.create({
      data: {
        salonId: salon.id,
        name: 'Corte Mujer',
        durationMinutes: 30,
        price: 15000,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        salonId: salon.id,
        name: 'Corte Hombre',
        durationMinutes: 20,
        price: 8000,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        salonId: salon.id,
        name: 'Tinte Completo',
        durationMinutes: 90,
        price: 35000,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        salonId: salon.id,
        name: 'Manicure',
        durationMinutes: 45,
        price: 12000,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        salonId: salon.id,
        name: 'Pedicure',
        durationMinutes: 60,
        price: 15000,
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        salonId: salon.id,
        name: 'Mechas',
        durationMinutes: 120,
        price: 45000,
        active: true,
      },
    }),
  ])

  console.log('✅ Servicios creados:', services.length)

  // Crear Staff Members
  const carmen = await prisma.staffMember.create({
    data: {
      salonId: salon.id,
      name: 'Carmen Martínez',
      services: [services[0].id, services[1].id, services[2].id, services[5].id], // Cortes y color
      active: true,
    },
  })

  const rosa = await prisma.staffMember.create({
    data: {
      salonId: salon.id,
      name: 'Rosa López',
      services: [services[0].id, services[1].id, services[2].id], // Cortes y tinte
      active: true,
    },
  })

  const ana = await prisma.staffMember.create({
    data: {
      salonId: salon.id,
      name: 'Ana Rojas',
      services: [services[3].id, services[4].id], // Manicure y Pedicure
      active: true,
    },
  })

  console.log('✅ Personal creado: Carmen, Rosa, Ana')

  // Crear Usuario Owner
  const ownerPassword = await hash('admin123', 10)
  const owner = await prisma.user.create({
    data: {
      email: 'maria@salonbelleza.com',
      password: ownerPassword,
      role: 'SALON_OWNER',
      salonId: salon.id,
    },
  })

  console.log('✅ Usuario owner creado:', owner.email)

  // Crear Usuarios Staff
  const carmenPassword = await hash('staff123', 10)
  await prisma.user.create({
    data: {
      email: 'carmen@salonbelleza.com',
      password: carmenPassword,
      role: 'SALON_STAFF',
      salonId: salon.id,
      staffMemberId: carmen.id,
    },
  })

  const rosaPassword = await hash('staff123', 10)
  await prisma.user.create({
    data: {
      email: 'rosa@salonbelleza.com',
      password: rosaPassword,
      role: 'SALON_STAFF',
      salonId: salon.id,
      staffMemberId: rosa.id,
    },
  })

  const anaPassword = await hash('staff123', 10)
  await prisma.user.create({
    data: {
      email: 'ana@salonbelleza.com',
      password: anaPassword,
      role: 'SALON_STAFF',
      salonId: salon.id,
      staffMemberId: ana.id,
    },
  })

  console.log('✅ Usuarios staff creados')

  // Crear Super Admin
  const superAdminPassword = await hash('superadmin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@reservaya.app',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Super Admin creado: admin@reservaya.app')

  // Crear Horarios de Trabajo (Lunes a Sábado, 9:00 - 18:00)
  const workingDays = [1, 2, 3, 4, 5, 6] // Lunes a Sábado

  for (const day of workingDays) {
    // Horarios generales del salón
    await prisma.workingHours.create({
      data: {
        salonId: salon.id,
        staffId: carmen.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    })

    await prisma.workingHours.create({
      data: {
        salonId: salon.id,
        staffId: rosa.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    })

    await prisma.workingHours.create({
      data: {
        salonId: salon.id,
        staffId: ana.id,
        dayOfWeek: day,
        startTime: '10:00',
        endTime: '19:00',
      },
    })
  }

  console.log('✅ Horarios de trabajo creados')

  console.log('')
  console.log('🎉 ¡Seed completado exitosamente!')
  console.log('')
  console.log('📝 Credenciales de acceso:')
  console.log('----------------------------')
  console.log('Owner:      maria@salonbelleza.com / admin123')
  console.log('Staff:      carmen@salonbelleza.com / staff123')
  console.log('Staff:      rosa@salonbelleza.com / staff123')
  console.log('Staff:      ana@salonbelleza.com / staff123')
  console.log('SuperAdmin: admin@reservaya.app / superadmin123')
  console.log('')
  console.log('🔗 URL de reservas: http://localhost:3000/salon-belleza-maria')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

