import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get("barberId");
    const date = searchParams.get("date");

    const where: any = {};
    if (barberId) where.barberId = barberId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        barber: true,
        service: true,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { barberId, serviceId, customerName, customerPhone, date, startTime, notes } = body;

    if (!barberId || !serviceId || !customerName || !customerPhone || !date || !startTime) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Find or create customer by phone
    let customer = await prisma.customer.findFirst({
      where: { phone: customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
        },
      });
    }

    // Calculate end time based on service duration
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    const durationMinutes = service ? service.duration : 30;

    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const endMinutes = (totalMinutes % 60).toString().padStart(2, "0");
    const endTime = `${endHours}:${endMinutes}`;

    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        barberId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        notes: notes || null,
        status: "CONFIRMED",
      },
      include: {
        customer: true,
        barber: true,
        service: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
