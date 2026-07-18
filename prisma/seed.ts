import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create default Admin
  const adminPassword = await bcrypt.hash("admin", 10);
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Administrador Atlas Reserve",
    },
  });
  console.log("Admin created: admin@example.com / admin");

  // 2. Create Default Settings
  const setting = await prisma.setting.findFirst();
  if (!setting) {
    await prisma.setting.create({
      data: {
        shopName: "Atlas Reserve",
        logoUrl: "/logo.jpg",
        whatsapp: "(11) 99999-9999",
        instagram: "@atlasreserve",
        address: "Rua Exemplo, 123 - Centro, São Paulo",
        primaryColor: "#000000",
        secondaryColor: "#D4AF37",
        landingText: "Experiência premium de barbearia. Qualidade impecável e atendimento personalizado.",
      },
    });
    console.log("Default Settings created.");
  }

  // 3. Create Barbers
  const barber1 = await prisma.barber.upsert({
    where: { slug: "joao-silva" },
    update: {},
    create: {
      name: "João Silva",
      slug: "joao-silva",
      specialty: "Cortes Clássicos",
      phone: "(11) 91234-5678",
      photoUrl: "https://images.unsplash.com/photo-1503467913725-8484b65b0715?auto=format&fit=crop&q=80&w=400",
      workDays: ["1", "2", "3", "4", "5", "6"],
      startTime: "09:00",
      endTime: "19:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      color: "#3B82F6",
      isActive: true,
    },
  });

  const barber2 = await prisma.barber.upsert({
    where: { slug: "pedro-santos" },
    update: {},
    create: {
      name: "Pedro Santos",
      slug: "pedro-santos",
      specialty: "Barbas Modernas",
      phone: "(11) 99876-5432",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      workDays: ["1", "2", "3", "4", "5", "6"],
      startTime: "09:00",
      endTime: "19:00",
      breakStart: "13:00",
      breakEnd: "14:00",
      color: "#10B981",
      isActive: true,
    },
  });
  console.log("Barbers created:", barber1.name, barber2.name);

  // 4. Create Services
  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        {
          name: "Corte Clássico",
          description: "Corte tradicional com acabamento perfeito na tesoura ou máquina",
          price: 45.0,
          duration: 30,
          imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400",
          isActive: true,
        },
        {
          name: "Barba Completa",
          description: "Aparo, modelagem, toalha quente e hidratação especial",
          price: 35.0,
          duration: 20,
          imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400",
          isActive: true,
        },
        {
          name: "Combo Corte + Barba",
          description: "Pacote completo de corte de cabelo e barba tradicional",
          price: 70.0,
          duration: 50,
          imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400",
          isActive: true,
        },
      ],
    });
    console.log("Services created.");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
