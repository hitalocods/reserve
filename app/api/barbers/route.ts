import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(barbers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, specialty, phone, instagram, photoUrl, startTime, endTime, breakStart, breakEnd, color, workDays } = body;

    if (!name || !specialty) {
      return NextResponse.json({ error: "Nome e especialidade são obrigatórios" }, { status: 400 });
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug exists, add random string if needed
    const existing = await prisma.barber.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const barber = await prisma.barber.create({
      data: {
        name,
        slug,
        specialty,
        phone: phone || null,
        instagram: instagram || null,
        photoUrl: photoUrl || null,
        startTime: startTime || "09:00",
        endTime: endTime || "19:00",
        breakStart: breakStart || "12:00",
        breakEnd: breakEnd || "13:00",
        color: color || "#000000",
        workDays: workDays || ["1", "2", "3", "4", "5", "6"],
        isActive: true,
      },
    });

    return NextResponse.json(barber, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
