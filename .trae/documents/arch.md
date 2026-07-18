
# Arquitetura Técnica - Sistema de Gestão de Barbearia

## 1. Stack Tecnológica
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript 5
- **Estilização**: TailwindCSS + shadcn/ui
- **ORM**: Prisma ORM
- **Banco de Dados**: Neon PostgreSQL
- **Armazenamento de Arquivos**: Vercel Blob
- **Formulários**: React Hook Form + Zod
- **Animações**: Framer Motion
- **Ícones**: Lucide Icons

## 2. Estrutura de Pastas
```
c:\Reserve/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (public)/
│   │   ├── page.tsx (Landing Page)
│   │   ├── agendar/
│   │   └── agenda/[barberSlug]/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── servicos/
│   │   ├── combos/
│   │   ├── promocoes/
│   │   ├── barbeiros/
│   │   ├── agenda/
│   │   ├── clientes/
│   │   └── configuracoes/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   └── actions/
├── prisma/
│   └── schema.prisma
├── public/
└── package.json
```

## 3. Modelos do Banco de Dados (Prisma Schema)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Barber {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  photoUrl    String?
  specialty   String
  phone       String?
  instagram   String?
  workDays    String[] // ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]
  startTime   String    // "09:00"
  endTime     String    // "19:00"
  breakStart  String?   // "12:00"
  breakEnd    String?   // "13:00"
  color       String    // "#..."
  isActive    Boolean   @default(true)
  appointments Appointment[]
  blockedDates BlockedDate[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Service {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Decimal
  duration    Int // minutos
  imageUrl    String?
  isActive    Boolean   @default(true)
  appointments Appointment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Combo {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Decimal
  duration    Int // minutos
  imageUrl    String?
  isActive    Boolean   @default(true)
  services    Service[]
  appointments Appointment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Promotion {
  id          String    @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  price       Decimal
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Customer {
  id           String        @id @default(cuid())
  name         String
  phone        String
  appointments Appointment[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Appointment {
  id          String      @id @default(cuid())
  customerId  String
  customer    Customer    @relation(fields: [customerId], references: [id])
  barberId    String
  barber      Barber      @relation(fields: [barberId], references: [id])
  serviceId   String?
  service     Service?    @relation(fields: [serviceId], references: [id])
  comboId     String?
  combo       Combo?      @relation(fields: [comboId], references: [id])
  date        DateTime
  startTime   String
  endTime     String
  status      AppointmentStatus @default(PENDING)
  notes       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model Setting {
  id            String   @id @default(cuid())
  shopName      String
  logoUrl       String?
  bannerUrl     String?
  whatsapp      String
  instagram     String?
  facebook      String?
  address       String
  googleMapsUrl String?
  primaryColor  String   @default("#000000")
  secondaryColor String @default("#D4AF37")
  landingText   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model BusinessHour {
  id        String   @id @default(cuid())
  dayOfWeek Int      // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  openTime  String
  closeTime String
  isClosed  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model BlockedDate {
  id        String   @id @default(cuid())
  barberId  String?
  barber    Barber?   @relation(fields: [barberId], references: [id])
  date      DateTime
  reason    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Gallery {
  id        String   @id @default(cuid())
  imageUrl  String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Banner {
  id        String   @id @default(cuid())
  imageUrl  String
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 4. Principais Componentes e Páginas
- Landing Page: `/app/(public)/page.tsx`
- Fluxo de Agendamento: `/app/(public)/agendar/`
- Painel Admin: `/app/(admin)/`
- Link do Barbeiro: `/app/(public)/agenda/[barberSlug]/`

## 5. Autenticação e Segurança
- Middleware para proteger rotas admin
- Server Actions com validação Zod
- Senhas hasheadas com bcrypt
- Armazenamento de imagens via Vercel Blob

