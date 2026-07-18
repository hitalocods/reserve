import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let hours = await prisma.businessHour.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    if (hours.length === 0) {
      // Initialize default business hours (0: Dom, 1: Seg, ..., 6: Sáb)
      const defaultHours = [
        { dayOfWeek: 0, openTime: "09:00", closeTime: "14:00", isClosed: true },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 6, openTime: "08:00", closeTime: "20:00", isClosed: false },
      ];

      for (const dh of defaultHours) {
        await prisma.businessHour.create({ data: dh });
      }

      hours = await prisma.businessHour.findMany({
        orderBy: { dayOfWeek: "asc" },
      });
    }

    return NextResponse.json(hours);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json(); // Array of business hours
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Formato de dados inválido" }, { status: 400 });
    }

    for (const item of body) {
      if (item.id) {
        await prisma.businessHour.update({
          where: { id: item.id },
          data: {
            openTime: item.openTime,
            closeTime: item.closeTime,
            isClosed: item.isClosed,
          },
        });
      } else if (item.dayOfWeek !== undefined) {
        await prisma.businessHour.upsert({
          where: { id: item.id || "dummy" },
          update: {
            openTime: item.openTime,
            closeTime: item.closeTime,
            isClosed: item.isClosed,
          },
          create: {
            dayOfWeek: item.dayOfWeek,
            openTime: item.openTime,
            closeTime: item.closeTime,
            isClosed: item.isClosed,
          },
        });
      }
    }

    const updatedHours = await prisma.businessHour.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(updatedHours);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
