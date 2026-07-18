import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, duration, imageUrl } = body;

    if (!name || !price || !duration) {
      return NextResponse.json({ error: "Nome, preço e duração são obrigatórios" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
