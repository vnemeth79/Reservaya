# ReservaYa - Sistema de Reservas para Salones de Belleza

Un moderno sistema de reservas online para salones de belleza, desarrollado con Next.js 14, PostgreSQL y Tailwind CSS.

## 🌟 Características

- **Reservas Online 24/7**: Los clientes pueden reservar citas en cualquier momento
- **Multi-tenant**: Cada salón tiene su propia URL y panel de administración
- **Panel de Administración**: Gestión completa del salón, personal y servicios
- **Panel de Staff**: Cada profesional puede ver y gestionar sus propias citas
- **Notificaciones por Email**: Confirmaciones y recordatorios automáticos
- **Código QR**: Genera un código QR para que los clientes reserven fácilmente
- **Diseño Responsivo**: Funciona perfectamente en móviles y escritorio
- **100% en Español**: Toda la interfaz está en español

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS + shadcn/ui
- **Email**: Resend
- **Lenguaje**: TypeScript

## 📁 Estructura del Proyecto

```
reservaya/
├── app/
│   ├── (admin)/admin/        # Panel de administración
│   ├── (auth)/login/         # Páginas de autenticación
│   ├── (public)/[salonSlug]/ # Página pública de reservas
│   ├── (staff)/staff/        # Panel de staff
│   └── api/                  # API endpoints
├── components/
│   ├── admin/                # Componentes del admin
│   ├── booking/              # Componentes de reservas
│   ├── staff/                # Componentes del staff
│   └── ui/                   # Componentes de shadcn/ui
├── lib/
│   ├── auth.ts               # Configuración de NextAuth
│   ├── db.ts                 # Cliente de Prisma
│   ├── email.ts              # Envío de emails
│   └── lang/es.ts            # Traducciones en español
└── prisma/
    ├── schema.prisma         # Esquema de la base de datos
    └── seed.ts               # Datos de demostración
```

## 🚀 Instalación

### 1. Clonar e instalar dependencias

```bash
cd reservaya
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="genera-un-secreto-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Resend (Email)
RESEND_API_KEY="re_xxxxx"

# URL de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma db push

# (Opcional) Cargar datos de demostración
npm run db:seed
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👤 Credenciales de Demostración

Después de ejecutar el seed:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Dueño | maria@salonbelleza.com | admin123 |
| Staff | carmen@salonbelleza.com | staff123 |
| Staff | rosa@salonbelleza.com | staff123 |
| Staff | ana@salonbelleza.com | staff123 |
| Super Admin | admin@reservaya.app | superadmin123 |

## 📱 URLs Importantes

- **Página de Reservas**: `http://localhost:3000/salon-belleza-maria`
- **Panel Admin**: `http://localhost:3000/admin`
- **Panel Staff**: `http://localhost:3000/staff`
- **Login**: `http://localhost:3000/login`

## 📧 Configuración de Email (Resend)

1. Crea una cuenta en [Resend](https://resend.com)
2. Obtén tu API Key
3. Agrega la API Key en el archivo `.env`
4. Para producción, verifica tu dominio en Resend

## 🗄️ Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > Database
3. Copia la URL de conexión
4. Agrégala en `DATABASE_URL` en tu `.env`

## 📝 Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run db:push      # Sincronizar esquema con la base de datos
npm run db:seed      # Cargar datos de demostración
npm run db:studio    # Abrir Prisma Studio
```

## 🔒 Roles y Permisos

- **SUPER_ADMIN**: Acceso total a todos los salones
- **SALON_OWNER**: Administra su propio salón
- **SALON_STAFF**: Ve y gestiona solo sus propias citas

## 📄 Licencia

MIT License

---

Desarrollado con ❤️ para salones de belleza

